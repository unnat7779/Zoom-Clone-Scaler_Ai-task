import { describe, expect, it } from "vitest";
import { type RoomUiAction, type RoomUiState, initialRoomUiState, roomUiReducer } from "./roomUiReducer";

const reduce = (actions: RoomUiAction[], state: RoomUiState = initialRoomUiState) => actions.reduce(roomUiReducer, state);

describe("roomUiReducer panels", () => {
  it("stacks Participants above Chat regardless of opening order", () => {
    expect(reduce([{ type: "togglePanel", panel: "chat" }, { type: "togglePanel", panel: "participants" }]).panels).toEqual([
      "participants",
      "chat",
    ]);
  });

  it("closes a panel when toggled again, keeping the other one", () => {
    const state = reduce([
      { type: "togglePanel", panel: "participants" },
      { type: "togglePanel", panel: "chat" },
      { type: "togglePanel", panel: "participants" },
    ]);
    expect(state.panels).toEqual(["chat"]);
  });

  it("shows Host tools alone and replaces it when another panel opens", () => {
    const hostTools = reduce([
      { type: "togglePanel", panel: "participants" },
      { type: "togglePanel", panel: "chat" },
      { type: "openHostTools", page: "advanced" },
    ]);
    expect(hostTools).toMatchObject({ panels: ["hostTools"], hostToolsPage: "advanced" });
    expect(roomUiReducer(hostTools, { type: "togglePanel", panel: "chat" })).toMatchObject({
      panels: ["chat"],
      hostToolsPage: "root",
    });
  });

  it("resets the minimized panel and the open menu when panels change", () => {
    const state = reduce([
      { type: "togglePanel", panel: "participants" },
      { type: "toggleMinimized", panel: "participants" },
      { type: "toggleMenu", menu: "more" },
      { type: "togglePanel", panel: "chat" },
    ]);
    expect(state).toMatchObject({ minimized: null, menu: null });
  });

  it("closePanel only removes that panel and un-minimizes", () => {
    const state = reduce([
      { type: "togglePanel", panel: "participants" },
      { type: "togglePanel", panel: "chat" },
      { type: "toggleMinimized", panel: "chat" },
      { type: "toggleMenu", menu: "audio" },
      { type: "closePanel", panel: "chat" },
    ]);
    expect(state).toMatchObject({ panels: ["participants"], minimized: null, menu: "audio" });
  });
});

describe("roomUiReducer menus and dialogs", () => {
  it("keeps one menu open at a time and toggles it closed", () => {
    const open = reduce([{ type: "toggleMenu", menu: "audio" }, { type: "toggleMenu", menu: "video" }]);
    expect(open.menu).toBe("video");
    expect(roomUiReducer(open, { type: "toggleMenu", menu: "video" }).menu).toBeNull();
  });

  it("returns the same state object when closing an already closed menu", () => {
    expect(roomUiReducer(initialRoomUiState, { type: "closeMenu" })).toBe(initialRoomUiState);
  });

  it.each<RoomUiAction>([
    { type: "setLeaveOpen", open: true },
    { type: "setDialog", dialog: { type: "remove", participantId: 4, name: "Guest" } },
    { type: "setInviteOpen", open: true },
    { type: "setDialog", dialog: { type: "captions" } },
    { type: "setBreakoutOpen", open: true },
  ])("$type closes the open menu", (action) => {
    expect(reduce([{ type: "toggleMenu", menu: "participants" }, action]).menu).toBeNull();
  });

  it("toggles the view flags and closes the permission bar for good", () => {
    const state = reduce([
      { type: "toggleAlwaysShowBars" },
      { type: "toggleHideSelfView" },
      { type: "toggleHideSelfView" },
      { type: "closePermissionBar" },
      { type: "closePermissionBar" },
    ]);
    expect(state).toMatchObject({ alwaysShowBars: true, hideSelfView: false, permissionBarClosed: true });
  });
});

describe("roomUiReducer promoted More item", () => {
  it("keeps one temporary toolbar button: the latest pick wins", () => {
    const state = reduce([
      { type: "promote", item: "captions" },
      { type: "promote", item: "breakout" },
    ]);
    expect(state.promoted).toBe("breakout");
  });

  it("Reset goes back to the default toolbar without touching panels or windows", () => {
    const state = reduce([
      { type: "togglePanel", panel: "participants" },
      { type: "setBreakoutOpen", open: true },
      { type: "promote", item: "settings" },
      { type: "resetToolbar" },
    ]);
    expect(state).toMatchObject({ promoted: null, panels: ["participants"], breakoutOpen: true });
  });
});
