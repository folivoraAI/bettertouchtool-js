// GENERATED FILE — do not edit. Run `npm run generate`.
// Source: BetterTouchTool action-definitions.mdx (407 actions)

export interface ActionParamDoc {
  key: string;
  description: string;
  children?: ActionParamDoc[];
}

export interface ActionDefinition {
  /** BTTPredefinedActionType */
  id: number;
  name: string;
  /** camelCase identifier */
  slug: string;
  category: string;
  description: string;
  params: ActionParamDoc[];
  example: Record<string, unknown> | null;
}

/** All known BTTPredefinedActionType values by name. */
export const ActionType = {
  /** Left Click — Performs a standard left mouse click at the current cursor position. It will include the currently pressed modifier keys. */
  LEFT_CLICK: 3,
  /** Left Click - Without Modifier Keys — Performs a left mouse click at the current location. It will NOT include any modifier keys. */
  LEFT_CLICK_WITHOUT_MODIFIER_KEYS: 421,
  /** Right Click — Performs a right mouse click at the current cursor position. It will include the currently pressed modifier keys. */
  RIGHT_CLICK: 4,
  /** Middle Click — Performs a middle mouse click at the current location. It will include the currently pressed modifier keys. */
  MIDDLE_CLICK: 1,
  /** Double Left Click — Performs a double left mouse click at the current location. It will include the current modifier keys. */
  DOUBLE_LEFT_CLICK: 54,
  /** Ctrl + Left Click — Presses the ctrl modifier key and then performs a left click. */
  CTRL_LEFT_CLICK: 87,
  /** Opt + Left Click — Presses the option modifier key and then performs a left click. */
  OPT_LEFT_CLICK: 88,
  /** CMD + Left Click — Presses the command modifier key and then performs a left click. */
  CMD_LEFT_CLICK: 2,
  /** CMD + Double Left Click — Presses the command modifier key and then performs a double left click. This can e.g. be used to open a file in a new tab in Finder. */
  CMD_DOUBLE_LEFT_CLICK: 149,
  /** CMD + Shift + Left Click — Presses the command and shift modifier keys and then performs a left click. */
  CMD_SHIFT_LEFT_CLICK: 111,
  /** Custom Click (Custom Mouse Buttons & Modifiers) — Performs custom mouse clicks with various options including button type, modifiers, and click behavior. */
  CUSTOM_CLICK_CUSTOM_MOUSE_BUTTONS_AND_MODIFIERS: 119,
  /** Move Mouse To Position — Moves the mouse cursor to a specific position on screen. */
  MOVE_MOUSE_TO_POSITION: 153,
  /** Save Current Mouse Position — Saves the current mouse cursor position for later restoration. */
  SAVE_CURRENT_MOUSE_POSITION: 154,
  /** Restore Saved Mouse Position — Restores the mouse cursor to a previously saved position. If a variable identifier is provided, it first checks the BTT variable with that name for a saved position before falling back to UserDefaults. */
  RESTORE_SAVED_MOUSE_POSITION: 155,
  /** Start Drag — Initiates a drag operation at the current mouse position. */
  START_DRAG: 65,
  /** Stop Drag — Ends the current drag operation. */
  STOP_DRAG: 66,
  /** Toggle Mouse Speed — Toggles between different mouse speed settings. */
  TOGGLE_MOUSE_SPEED: 126,
  /** Toggle Cursor Size — Toggles the cursor between normal and large size. */
  TOGGLE_CURSOR_SIZE: 123,
  /** Set Cursor Size — Sets the cursor to a specific size. */
  SET_CURSOR_SIZE: 411,
  /** Scroll — Sends scroll events. */
  SCROLL: 272,
  /** Shift + Click — Presses the shift modifier key and then performs a left click. */
  SHIFT_CLICK: 89,
  /** Start Drag By Double-Click — Starts a mouse drag operation initiated by a double-click. */
  START_DRAG_BY_DOUBLE_CLICK: 296,
  /** Toggle Magic Mouse Touchpad Mode — Toggles Magic Mouse touchpad mode on or off. */
  TOGGLE_MAGIC_MOUSE_TOUCHPAD_MODE: 68,
  /** Change Mouse Speed And Acceleration — Changes mouse tracking speed and acceleration settings. */
  CHANGE_MOUSE_SPEED_AND_ACCELERATION: 559,
  /** Pick Color On Screen And Write To Clipboard — Opens a color picker to select a color from anywhere on screen and writes the result to the clipboard. */
  PICK_COLOR_ON_SCREEN_AND_WRITE_TO_CLIPBOARD: 546,
  /** All Modifier Keys UP — Releases all modifier keys (Fn, Shift, Ctrl, Option, Command). Useful in action sequences to ensure a clean modifier state. */
  ALL_MODIFIER_KEYS_UP: 547,
  /** Type String — Types a predefined string of text. */
  TYPE_STRING: 193,
  /** Paste String — Pastes a predefined string of text (faster than typing). */
  PASTE_STRING: 118,
  /** Send Keyboard Shortcut — Sends a keyboard shortcut to the system - just as if you had pressed it on your keyboard. */
  SEND_KEYBOARD_SHORTCUT: 264,
  /** Send Shortcut to Specific App — Sends a keyboard shortcut to a specific application. */
  SEND_SHORTCUT_TO_SPECIFIC_APP: 128,
  /** Function Keys (F1-F24) — Simulates pressing function keys. */
  FUNCTION_KEYS_F1_F24: 43,
  /** Modifier Key Actions — Simulates pressing and releasing modifier keys. By default these use real macOS modifier state. For apps that react to the flagsChanged event stream rather than real held modifier state, optional compatibility options can be configured via `BTTAdditionalActionData`. */
  MODIFIER_KEY_ACTIONS: 186,
  /** Set / Press / Release Selected Modifier Keys — Manages multiple modifier keys at once with configurable mode and behavior. Supports pressing, releasing, or setting an exact combination of modifier keys including left/right variants. */
  SET_PRESS_RELEASE_SELECTED_MODIFIER_KEYS: 597,
  /** ESC Key — Simulates pressing the Escape key. */
  ESC_KEY: 189,
  /** Toggle Caps Lock — Toggles the Caps Lock state on/off. */
  TOGGLE_CAPS_LOCK: 194,
  /** Page Navigation Keys — Simulates page navigation keys. */
  PAGE_NAVIGATION_KEYS: 60,
  /** Arrow Keys — Simulates arrow key presses. */
  ARROW_KEYS: 51,
  /** Remap Key — Remaps one key to another. */
  REMAP_KEY: 483,
  /** Reset All Key Remappings — Resets all low-level keyboard key remappings to their defaults. */
  RESET_ALL_KEY_REMAPPINGS: 482,
  /** Act as Hyper Key — Makes the trigger key act as a Hyper Key (simultaneous Ctrl+Shift+Opt+Cmd). */
  ACT_AS_HYPER_KEY: 293,
  /** Reset Current Key Sequence — Resets / stops the currently active key sequence recognition. */
  RESET_CURRENT_KEY_SEQUENCE: 422,
  /** Press Context Menu Key — Simulates pressing the context menu key to show the context menu for the current selection. */
  PRESS_CONTEXT_MENU_KEY: 532,
  /** Maximize Window — Maximizes the current window to full screen (not fullscreen mode). */
  MAXIMIZE_WINDOW: 21,
  /** Maximize Window Left — Maximizes window to the left half of the screen. */
  MAXIMIZE_WINDOW_LEFT: 19,
  /** Maximize Window Right — Maximizes window to the right half of the screen. */
  MAXIMIZE_WINDOW_RIGHT: 20,
  /** Resize Window to Quarters — Resizes window to specific quarter of the screen. */
  RESIZE_WINDOW_TO_QUARTERS: 90,
  /** Resize Window to Thirds — Resizes window to specific third of the screen. */
  RESIZE_WINDOW_TO_THIRDS: 108,
  /** Resize Window to Halves — Resizes window to top or bottom half of the screen. */
  RESIZE_WINDOW_TO_HALVES: 96,
  /** Center Window — Centers the current window on screen. */
  CENTER_WINDOW: 97,
  /** Center Window on Next Monitor — Centers the window on the next monitor. */
  CENTER_WINDOW_ON_NEXT_MONITOR: 98,
  /** Move Window to Next Monitor — Moves the current window to the next monitor. */
  MOVE_WINDOW_TO_NEXT_MONITOR: 47,
  /** Maximize Window on Next Monitor — Maximizes the window on the next monitor. */
  MAXIMIZE_WINDOW_ON_NEXT_MONITOR: 48,
  /** Restore Old Window Size — Restores window to its previous size before maximizing. */
  RESTORE_OLD_WINDOW_SIZE: 84,
  /** Close Window Under Cursor — Closes the window under the mouse cursor. */
  CLOSE_WINDOW_UNDER_CURSOR: 102,
  /** Minimize Window Under Cursor — Minimizes the window under the mouse cursor. */
  MINIMIZE_WINDOW_UNDER_CURSOR: 106,
  /** Zoom Window Under Cursor — Zooms (green button) the window under cursor. */
  ZOOM_WINDOW_UNDER_CURSOR: 107,
  /** Bring Window Under Cursor to Front — Brings the window under the cursor to the front. */
  BRING_WINDOW_UNDER_CURSOR_TO_FRONT: 204,
  /** Move Window Left/Right — Moves window by a small amount left or right. */
  MOVE_WINDOW_LEFT_RIGHT: 17,
  /** Start/Stop Moving Windows — Makes the window under the cursor follow the mouse until moving is stopped. */
  START_STOP_MOVING_WINDOWS: 69,
  /** Start/Stop Resizing Windows — Resizes the window under the cursor with mouse movement until resizing is stopped. */
  START_STOP_RESIZING_WINDOWS: 71,
  /** Custom Move/Resize — Moves and resizes window with custom parameters. */
  CUSTOM_MOVE_RESIZE: 251,
  /** Move Window to Specific Size and Position — Moves window to exact coordinates and size. */
  MOVE_WINDOW_TO_SPECIFIC_SIZE_AND_POSITION: 446,
  /** Window Layout Management — Save and restore window layouts. */
  WINDOW_LAYOUT_MANAGEMENT: 269,
  /** Save/Restore Focused Window Size And Position — Saves or restores the size and position of the currently focused window. */
  SAVE_RESTORE_FOCUSED_WINDOW_SIZE_AND_POSITION: 539,
  /** Close Window, If Last Window Quit App — Closes the current window. If it is the last window of the application, quits the app entirely. */
  CLOSE_WINDOW_IF_LAST_WINDOW_QUIT_APP: 560,
  /** Pin/Unpin Window to Float on Top — Makes window float above all others or removes float status. */
  PIN_UNPIN_WINDOW_TO_FLOAT_ON_TOP: 337,
  /** Window Switcher — Shows a window switcher for the current app or all apps. */
  WINDOW_SWITCHER: 99,
  /** Arrange Windows Side by Side — Arranges multiple windows side by side. */
  ARRANGE_WINDOWS_SIDE_BY_SIDE: 317,
  /** Sleep Display — Puts the display to sleep. */
  SLEEP_DISPLAY: 13,
  /** Sleep Computer — Puts the computer to sleep. */
  SLEEP_COMPUTER: 14,
  /** Logout — Logs out the current user. */
  LOGOUT: 15,
  /** Lock Screen — Locks the screen. */
  LOCK_SCREEN: 158,
  /** Unlock Screen — Unlocks the screen (requires password to be set). */
  UNLOCK_SCREEN: 159,
  /** Start Screen Saver — Starts the configured screen saver. */
  START_SCREEN_SAVER: 202,
  /** Empty Trash — Empties the trash. */
  EMPTY_TRASH: 156,
  /** Toggle Do Not Disturb — Toggles Do Not Disturb mode on/off. */
  TOGGLE_DO_NOT_DISTURB: 200,
  /** Toggle Dark Mode — Toggles between light and dark mode. */
  TOGGLE_DARK_MODE: 197,
  /** Toggle Night Shift — Toggles Night Shift on/off. */
  TOGGLE_NIGHT_SHIFT: 201,
  /** Toggle True Tone — Toggles True Tone display on/off. */
  TOGGLE_TRUE_TONE: 257,
  /** Show Desktop — Shows the desktop by hiding all windows. */
  SHOW_DESKTOP: 45,
  /** Hide All Windows — Hides all windows of all applications. */
  HIDE_ALL_WINDOWS: 50,
  /** Hide All But Active Window — Hides all windows except the currently active one. */
  HIDE_ALL_BUT_ACTIVE_WINDOW: 53,
  /** Show All Windows — Shows all hidden windows. */
  SHOW_ALL_WINDOWS: 488,
  /** Show/Hide Hidden Files — Toggles visibility of hidden files in Finder. */
  SHOW_HIDE_HIDDEN_FILES: 16,
  /** Notification Center — Shows the Notification Center. */
  NOTIFICATION_CENTER: 122,
  /** Control Center — Shows the Control Center. */
  CONTROL_CENTER: 290,
  /** Close All Notifications — Closes all visible notifications. */
  CLOSE_ALL_NOTIFICATIONS: 289,
  /** Show Character Viewer — Shows the macOS Character Viewer. */
  SHOW_CHARACTER_VIEWER: 167,
  /** Start Siri — Activates Siri. */
  START_SIRI: 173,
  /** Eject — Ejects removable media. */
  EJECT: 30,
  /** Refresh Status Bar Items — Refreshes all status bar items. */
  REFRESH_STATUS_BAR_ITEMS: 302,
  /** Search Selected Text With Google — Searches for the currently selected text using Google. */
  SEARCH_SELECTED_TEXT_WITH_GOOGLE: 58,
  /** Switch to Login Screen — Switches to the macOS login screen without logging out. */
  SWITCH_TO_LOGIN_SCREEN: 9,
  /** Launch Application — Launches a specific application. */
  LAUNCH_APPLICATION: 49,
  /** Show/Hide Specific Application — Shows or hides a specific application. */
  SHOW_HIDE_SPECIFIC_APPLICATION: 177,
  /** Quit Specific Application — Quits a specific application. Supports standard quit, force quit, and an optional fallback force quit after a timeout. */
  QUIT_SPECIFIC_APPLICATION: 592,
  /** Quit App Under Cursor — Quits the application that owns the window under cursor. */
  QUIT_APP_UNDER_CURSOR: 247,
  /** Hide App Under Cursor — Hides the application under cursor. */
  HIDE_APP_UNDER_CURSOR: 294,
  /** Application Switcher — Shows the application switcher. */
  APPLICATION_SWITCHER: 142,
  /** Activate Previous App — Switches to the previously active application. */
  ACTIVATE_PREVIOUS_APP: 367,
  /** Activate Previous Window — Activates the previous window. */
  ACTIVATE_PREVIOUS_WINDOW: 491,
  /** Save Active Window — Saves reference to currently active window. */
  SAVE_ACTIVE_WINDOW: 368,
  /** Go Back to Saved Active Window — Returns to previously saved active window. */
  GO_BACK_TO_SAVED_ACTIVE_WINDOW: 369,
  /** Activate Specific Window — Activates a window by title or other criteria. */
  ACTIVATE_SPECIFIC_WINDOW: 364,
  /** Expose And Sort — Shows Expose and sorts windows automatically. */
  EXPOSE_AND_SORT: 103,
  /** Show Menu Bar in Context Menu — Shows the application's menu bar as a context menu at the current mouse position. */
  SHOW_MENU_BAR_IN_CONTEXT_MENU: 125,
  /** Show Shortcuts in Context Menu — Shows macOS Shortcuts app shortcuts in a context menu. */
  SHOW_SHORTCUTS_IN_CONTEXT_MENU: 298,
  /** Activate Hovered App in Dock — Activates the application whose Dock icon is currently hovered. */
  ACTIVATE_HOVERED_APP_IN_DOCK: 150,
  /** Open Finder — Opens a new Finder window. */
  OPEN_FINDER: 10,
  /** Create New File in Finder — Creates a new file in the current Finder location and can immediately reveal and open it. */
  CREATE_NEW_FILE_IN_FINDER: 85,
  /** Open Finder Selection with Specific App — Opens selected files in Finder with a specific application. */
  OPEN_FINDER_SELECTION_WITH_SPECIFIC_APP: 157,
  /** Compress Currently Selected Finder File — Compresses the currently selected file or folder in Finder into a .zip archive placed next to it (a number is appended to the archive name if it already exists). */
  COMPRESS_CURRENTLY_SELECTED_FINDER_FILE: 604,
  /** Open Selected Folder with App — Opens selected folder with specific app. */
  OPEN_SELECTED_FOLDER_WITH_APP: 176,
  /** Play/Pause — Toggles media playback. */
  PLAY_PAUSE: 23,
  /** Next Track — Skips to the next track. */
  NEXT_TRACK: 27,
  /** Previous Track — Goes to the previous track. */
  PREVIOUS_TRACK: 26,
  /** Volume Up — Increases system volume. */
  VOLUME_UP: 24,
  /** Volume Down — Decreases system volume. */
  VOLUME_DOWN: 25,
  /** Volume Up (Small Step) — Increases volume by a small amount. */
  VOLUME_UP_SMALL_STEP: 198,
  /** Volume Down (Small Step) — Decreases volume by a small amount. */
  VOLUME_DOWN_SMALL_STEP: 199,
  /** Mute — Toggles system mute on/off. */
  MUTE: 22,
  /** Set Volume — Sets volume to specific level. */
  SET_VOLUME: 373,
  /** Set Audio Output Device — Changes the system audio output device. */
  SET_AUDIO_OUTPUT_DEVICE: 583,
  /** Set Audio Input Device — Changes the system audio input device. */
  SET_AUDIO_INPUT_DEVICE: 584,
  /** Toggle Mute Microphone (Audio Input) — Toggles the mute state of the microphone (audio input device). Optionally also sets the input volume to 0 when muting and restores it when unmuting. Can apply to all connected input devices or just the default input device. */
  TOGGLE_MUTE_MICROPHONE_AUDIO_INPUT: 585,
  /** Play Sound File — Plays a sound file. */
  PLAY_SOUND_FILE: 582,
  /** Brightness Up — Increases display brightness. */
  BRIGHTNESS_UP: 28,
  /** Brightness Down — Decreases display brightness. */
  BRIGHTNESS_DOWN: 29,
  /** Brightness Up (Small Step) — Increases brightness by a small amount. */
  BRIGHTNESS_UP_SMALL_STEP: 259,
  /** Brightness Down (Small Step) — Decreases brightness by a small amount. */
  BRIGHTNESS_DOWN_SMALL_STEP: 260,
  /** External Monitor Brightness Up — Increases external monitor brightness. */
  EXTERNAL_MONITOR_BRIGHTNESS_UP: 120,
  /** External Monitor Brightness Down — Decreases external monitor brightness. */
  EXTERNAL_MONITOR_BRIGHTNESS_DOWN: 121,
  /** External Brightness Up (Small Step) — Increases external brightness by small amount. */
  EXTERNAL_BRIGHTNESS_UP_SMALL_STEP: 261,
  /** External Brightness Down (Small Step) — Decreases external brightness by small amount. */
  EXTERNAL_BRIGHTNESS_DOWN_SMALL_STEP: 262,
  /** Set Brightness — Sets display brightness to specific level. */
  SET_BRIGHTNESS: 370,
  /** Keyboard Illumination Up — Increases keyboard backlight brightness. */
  KEYBOARD_ILLUMINATION_UP: 31,
  /** Keyboard Illumination Down — Decreases keyboard backlight brightness. */
  KEYBOARD_ILLUMINATION_DOWN: 32,
  /** Set Keyboard Brightness — Sets keyboard brightness to specific level. */
  SET_KEYBOARD_BRIGHTNESS: 477,
  /** Toggle Mirroring — Toggles display mirroring on/off. */
  TOGGLE_MIRRORING: 266,
  /** AirPlay Mirroring — Opens AirPlay mirroring options. */
  AIRPLAY_MIRRORING: 127,
  /** Toggle Super Brightness — Toggles super brightness mode for current display. */
  TOGGLE_SUPER_BRIGHTNESS: 326,
  /** Enable Super Brightness — Enables super brightness for current display. */
  ENABLE_SUPER_BRIGHTNESS: 324,
  /** Disable Super Brightness — Disables super brightness for current display. */
  DISABLE_SUPER_BRIGHTNESS: 325,
  /** Move & Maximize All Windows to Mouse Display — Moves and maximizes all windows to the display where the mouse is. */
  MOVE_AND_MAXIMIZE_ALL_WINDOWS_TO_MOUSE_DISPLAY: 267,
  /** Move All Windows to Mouse Display — Moves all windows to the display where the mouse is, preserving each window's size and relative position. */
  MOVE_ALL_WINDOWS_TO_MOUSE_DISPLAY: 273,
  /** Rotate Display Clockwise — Rotates the display 90 degrees clockwise. */
  ROTATE_DISPLAY_CLOCKWISE: 314,
  /** Rotate Display Counter-Clockwise — Rotates the display 90 degrees counter-clockwise. */
  ROTATE_DISPLAY_COUNTER_CLOCKWISE: 315,
  /** Mission Control — Shows Mission Control. */
  MISSION_CONTROL: 7,
  /** Mission Control & Show Desktop Preview — Shows Mission Control with desktop preview. */
  MISSION_CONTROL_AND_SHOW_DESKTOP_PREVIEW: 165,
  /** Application Exposé — Shows all windows of current application. */
  APPLICATION_EXPOS: 6,
  /** Switch to Desktop (1-19) — Switches to a specific desktop/space. */
  SWITCH_TO_DESKTOP_1_19: 207,
  /** Move Window to Desktop (1-19) — Moves current window to specific desktop. */
  MOVE_WINDOW_TO_DESKTOP_1_19: 216,
  /** Switch Space Left/Right — Switches to the space on the left or right. */
  SWITCH_SPACE_LEFT_RIGHT: 113,
  /** Move Window to Left/Right Space — Moves window to adjacent space. */
  MOVE_WINDOW_TO_LEFT_RIGHT_SPACE: 151,
  /** Add New Space — Creates a new desktop space. */
  ADD_NEW_SPACE: 196,
  /** Launchpad — Shows Launchpad. */
  LAUNCHPAD: 115,
  /** Dashboard — Shows Dashboard (deprecated in newer macOS). */
  DASHBOARD: 8,
  /** Navigate To Space Or Fullscreen App By ID or Index — Navigates to a specific space or fullscreen app using either its index or its unique ID. */
  NAVIGATE_TO_SPACE_OR_FULLSCREEN_APP_BY_ID_OR_INDEX: 550,
  /** Take Screenshot — Takes a screenshot with configurable options. */
  TAKE_SCREENSHOT: 169,
  /** Screenshot Window — Takes a screenshot of a specific window. */
  SCREENSHOT_WINDOW: 170,
  /** Screenshot and Edit — Takes a screenshot and opens it for editing. */
  SCREENSHOT_AND_EDIT: 171,
  /** Screenshot to Clipboard — Takes a screenshot directly to clipboard. */
  SCREENSHOT_TO_CLIPBOARD: 316,
  /** Screenshot to Clipboard (New) — Enhanced screenshot to clipboard with more options. */
  SCREENSHOT_TO_CLIPBOARD_NEW: 500,
  /** Take Screenshot or Video — Opens screenshot/recording toolbar. */
  TAKE_SCREENSHOT_OR_VIDEO: 263,
  /** Change Formatting of Clipboard Content — Changes the text formatting of the current clipboard/pasteboard content. Uses exactly the same `BTTActionChangeTextFormatting*` configuration keys as "Change Formatting of Selected Text" (action 494) — see that action for the full key list. */
  CHANGE_FORMATTING_OF_CLIPBOARD_CONTENT: 495,
  /** Measure Area on Screen — Shows tool to measure distances on screen. */
  MEASURE_AREA_ON_SCREEN: 501,
  /** Toggle Clipboard Manager — Shows/hides the clipboard manager. */
  TOGGLE_CLIPBOARD_MANAGER: 203,
  /** Show Clipboard Manager — Shows the clipboard manager window. */
  SHOW_CLIPBOARD_MANAGER: 480,
  /** Hide Clipboard Manager — Hides the clipboard manager window. */
  HIDE_CLIPBOARD_MANAGER: 481,
  /** Save Clipboard Contents — Temporarily saves current clipboard contents. */
  SAVE_CLIPBOARD_CONTENTS: 508,
  /** Restore Clipboard Contents — Restores previously saved clipboard contents. */
  RESTORE_CLIPBOARD_CONTENTS: 509,
  /** Set Clipboard Contents — Sets the clipboard to specific text or formatted content. */
  SET_CLIPBOARD_CONTENTS: 529,
  /** Upload Clipboard to Imgur — Uploads clipboard image to Imgur and copies URL. */
  UPLOAD_CLIPBOARD_TO_IMGUR: 297,
  /** Copy Selected Text with JavaScript — Copies selected text transformed by JavaScript. */
  COPY_SELECTED_TEXT_WITH_JAVASCRIPT: 287,
  /** Transform Clipboard with JavaScript — Transforms clipboard contents using a JavaScript transformer function. */
  TRANSFORM_CLIPBOARD_WITH_JAVASCRIPT: 448,
  /** Transform Clipboard with ChatGPT — Transforms clipboard using ChatGPT. */
  TRANSFORM_CLIPBOARD_WITH_CHATGPT: 449,
  /** Paste Specific Clipboard Item — Pastes item from clipboard history. */
  PASTE_SPECIFIC_CLIPBOARD_ITEM: 489,
  /** Delete Items from Clipboard Manager — Deletes selected items from clipboard history. */
  DELETE_ITEMS_FROM_CLIPBOARD_MANAGER: 487,
  /** Delete Specific Item from Clipboard — Deletes specific item from clipboard manager. */
  DELETE_SPECIFIC_ITEM_FROM_CLIPBOARD: 512,
  /** Paste and Remove Item — Pastes and removes item from clipboard manager. */
  PASTE_AND_REMOVE_ITEM: 484,
  /** Custom Paste — Pastes with custom options like plain text. */
  CUSTOM_PASTE: 250,
  /** Check Clipboard Change — Checks if clipboard has changed. */
  CHECK_CLIPBOARD_CHANGE: 328,
  /** Wait for Clipboard Change — Waits until clipboard content changes. */
  WAIT_FOR_CLIPBOARD_CHANGE: 499,
  /** Enable/Disable Clipboard Manager Watcher — Controls clipboard monitoring. */
  ENABLE_DISABLE_CLIPBOARD_MANAGER_WATCHER: 434,
  /** Copy to Snippet Group — Copies to a specific snippet group. */
  COPY_TO_SNIPPET_GROUP: 485,
  /** Copy/Paste Text Style — Copies or pastes text formatting. */
  COPY_PASTE_TEXT_STYLE: 496,
  /** Change Formatting of Selected Text — Changes formatting of selected text with extensive customization options. */
  CHANGE_FORMATTING_OF_SELECTED_TEXT: 494,
  /** Save Selected Text to Variable — Saves currently selected text to a variable. */
  SAVE_SELECTED_TEXT_TO_VARIABLE: 256,
  /** Transform Selected Text with JavaScript — Transforms selected text using JavaScript. */
  TRANSFORM_SELECTED_TEXT_WITH_JAVASCRIPT: 284,
  /** Transform Selected Text with ChatGPT — Transforms selected text using ChatGPT. */
  TRANSFORM_SELECTED_TEXT_WITH_CHATGPT: 384,
  /** ChatGPT Selection to Clipboard & Variable — Processes selection with ChatGPT, saves to clipboard and variable. */
  CHATGPT_SELECTION_TO_CLIPBOARD_AND_VARIABLE: 471,
  /** Reset ChatGPT Conversation — Resets the current ChatGPT conversation context. */
  RESET_CHATGPT_CONVERSATION: 385,
  /** Cancel ChatGPT Request — Cancels ongoing ChatGPT request. */
  CANCEL_CHATGPT_REQUEST: 470,
  /** OCR Area on Screen — Performs OCR on selected screen area. */
  OCR_AREA_ON_SCREEN: 498,
  /** Find Text on Screen — Searches for text on screen and clicks it. */
  FIND_TEXT_ON_SCREEN: 426,
  /** Wait for Text on Screen — Waits until specific text appears on screen. */
  WAIT_FOR_TEXT_ON_SCREEN: 427,
  /** Force Check Selection Change — Forces check for text selection change. */
  FORCE_CHECK_SELECTION_CHANGE: 493,
  /** Run AppleScript (Blocking) — Runs AppleScript and waits for completion. */
  RUN_APPLESCRIPT_BLOCKING: 172,
  /** Run AppleScript (Background) — Runs AppleScript in background without blocking. */
  RUN_APPLESCRIPT_BACKGROUND: 195,
  /** Run JavaScript (Background) — Executes JavaScript code in background. */
  RUN_JAVASCRIPT_BACKGROUND: 252,
  /** Run JavaScript (Main Thread) — Executes JavaScript code on main thread. */
  RUN_JAVASCRIPT_MAIN_THREAD: 253,
  /** Run Core JavaScript — Executes Core JavaScript code (BTT's built-in JS engine with async/await support). */
  RUN_CORE_JAVASCRIPT: 281,
  /** Run JavaScript in Browser — Evaluates JavaScript directly in the active tab of a web browser and returns the result. Uses the BetterTouchTool Safari/Chrome browser extension when available. If no matching extension is active, BTT falls back to browser scripting for Safari and Chromium based browsers. Use an async IIFE if you need `await`. Only Safari and Chromium based browsers are supported. */
  RUN_JAVASCRIPT_IN_BROWSER: 600,
  /** Terminal Command (Blocking) — Runs terminal command and waits for completion. */
  TERMINAL_COMMAND_BLOCKING: 246,
  /** Terminal Command (Background) — Runs terminal command in background. */
  TERMINAL_COMMAND_BACKGROUND: 137,
  /** Shell Script Task — Runs shell script with more options. */
  SHELL_SCRIPT_TASK: 206,
  /** Automator Workflow — Runs an Automator workflow. */
  AUTOMATOR_WORKFLOW: 138,
  /** Run Apple Shortcut — Runs a Shortcuts app shortcut. */
  RUN_APPLE_SHORTCUT: 295,
  /** Trigger Apple Shortcut from System Settings — Triggers system-level shortcut. */
  TRIGGER_APPLE_SHORTCUT_FROM_SYSTEM_SETTINGS: 519,
  /** Open BTT Preferences — Opens BetterTouchTool preferences window. */
  OPEN_BTT_PREFERENCES: 105,
  /** Open Specific BTT Settings — Opens specific section in BTT preferences. */
  OPEN_SPECIFIC_BTT_SETTINGS: 374,
  /** Restart BetterTouchTool — Restarts BetterTouchTool. */
  RESTART_BETTERTOUCHTOOL: 55,
  /** Quit BetterTouchTool — Quits BetterTouchTool. */
  QUIT_BETTERTOUCHTOOL: 56,
  /** Toggle BetterTouchTool — Enables/disables BetterTouchTool. */
  TOGGLE_BETTERTOUCHTOOL: 101,
  /** Disable Gesture Recognition — Temporarily disables gesture recognition. */
  DISABLE_GESTURE_RECOGNITION: 144,
  /** Disable Triggers for X Seconds — Disables all triggers temporarily. */
  DISABLE_TRIGGERS_FOR_X_SECONDS: 502,
  /** Switch to Preset — Switches to a specific preset. */
  SWITCH_TO_PRESET: 139,
  /** Toggle Preset — Enables/disables a specific preset. */
  TOGGLE_PRESET: 258,
  /** Trigger Named Trigger — Executes a named trigger by name. If the named trigger declares variables, values for them can be passed along. */
  TRIGGER_NAMED_TRIGGER: 248,
  /** Trigger Actions for Item with UUID — Triggers actions of specific item by UUID. */
  TRIGGER_ACTIONS_FOR_ITEM_WITH_UUID: 400,
  /** Show BTT Menu Bar Status Item Menu — Shows BTT's menu bar menu. */
  SHOW_BTT_MENU_BAR_STATUS_ITEM_MENU: 425,
  /** Disable Configured Trigger — Disables a specific trigger identified by its UUID. */
  DISABLE_CONFIGURED_TRIGGER: 552,
  /** Enable Configured Trigger — Enables a previously disabled trigger identified by its UUID. */
  ENABLE_CONFIGURED_TRIGGER: 553,
  /** Save Menu Bar Status Item Layout / Ordering — Saves the current arrangement and ordering of menu bar status items so it can be restored later. */
  SAVE_MENU_BAR_STATUS_ITEM_LAYOUT_ORDERING: 543,
  /** Restore Saved Menu Bar Status Item Layout / Ordering — Restores a previously saved menu bar status item arrangement. */
  RESTORE_SAVED_MENU_BAR_STATUS_ITEM_LAYOUT_ORDERING: 544,
  /** Change Menu Bar Status Item Spacing — Changes the spacing and padding between menu bar status items. */
  CHANGE_MENU_BAR_STATUS_ITEM_SPACING: 545,
  /** Show Simple JSON Format Menu — Shows a customizable menu built from a simple JSON format. Can use JavaScript to generate menu content dynamically. */
  SHOW_SIMPLE_JSON_FORMAT_MENU: 551,
  /** Toggle Touch Bar — Shows/hides the Touch Bar. */
  TOGGLE_TOUCH_BAR: 188,
  /** Show Touch Bar — Shows the Touch Bar. */
  SHOW_TOUCH_BAR: 282,
  /** Hide Touch Bar — Hides the Touch Bar. */
  HIDE_TOUCH_BAR: 283,
  /** Toggle Global Touch Bar — Toggles global Touch Bar visibility. */
  TOGGLE_GLOBAL_TOUCH_BAR: 190,
  /** Open Touch Bar Group — Opens a specific Touch Bar group. */
  OPEN_TOUCH_BAR_GROUP: 205,
  /** Close Current Touch Bar Group — Closes the currently open Touch Bar group. */
  CLOSE_CURRENT_TOUCH_BAR_GROUP: 191,
  /** Toggle Notch Bar Hidden — Shows/hides the Notch Bar. */
  TOGGLE_NOTCH_BAR_HIDDEN: 301,
  /** Show Notch Bar — Shows the Notch Bar. */
  SHOW_NOTCH_BAR: 312,
  /** Hide Notch Bar — Hides the Notch Bar. */
  HIDE_NOTCH_BAR: 311,
  /** Disable Notch Bar — Completely disables the Notch Bar. */
  DISABLE_NOTCH_BAR: 299,
  /** Toggle Notch Bar Mode — Toggles between Notch Bar modes. */
  TOGGLE_NOTCH_BAR_MODE: 300,
  /** Open Notch Bar Group — Opens specific Notch Bar group. */
  OPEN_NOTCH_BAR_GROUP: 310,
  /** Close Current Notch Bar Group — Closes current Notch Bar group. */
  CLOSE_CURRENT_NOTCH_BAR_GROUP: 309,
  /** Open Stream Deck Group — Opens a Stream Deck button group. */
  OPEN_STREAM_DECK_GROUP: 341,
  /** Close Current Stream Deck Group — Closes current Stream Deck group. */
  CLOSE_CURRENT_STREAM_DECK_GROUP: 340,
  /** Switch Stream Deck Plugin Profile — Switches the Stream Deck plugin to a different profile. Bundled starter profiles are available for all supported BTT Stream Deck plugin device types, and the amount is configurable when installing the BTT Stream Deck plugin. Leave the profile name empty to return to the previous profile. An optional page number (1-based) can be specified to jump directly to a specific page within the profile. If no target device serial is specified, BetterTouchTool switches all connected Stream Deck plugin devices. Legacy names such as `BTT Main` and `BTT Focus` are still recognized and mapped to the numbered starter profiles. */
  SWITCH_STREAM_DECK_PLUGIN_PROFILE: 593,
  /** Macro Pad: Change / Set Brightness — Changes (relative) or sets (absolute) the brightness of connected macro pad devices. These actions are hardware-agnostic: they drive Elgato Stream Deck devices as well as the Mirabox / AJAZZ "Stream Dock" family (AKP03, AKP05E, AKP153, M18 and rebadges) and Loupedeck / Razer Stream Controller devices. The action IDs are unchanged - only the displayed names were updated from "Stream Deck: Change/Set Brightness" to "Macro Pad: Change/Set Brightness". Non-Elgato macro pads require macOS 13.0 or later. */
  MACRO_PAD_CHANGE_SET_BRIGHTNESS: 344,
  /** Macro Pad: Turn Off / Turn On / Toggle — Turns connected macro pad devices off or on, or toggles them. Like the brightness actions these are hardware-agnostic and cover Elgato Stream Deck devices as well as the Mirabox / AJAZZ "Stream Dock" family and Loupedeck / Razer Stream Controller devices. The action IDs are unchanged - only the displayed names were updated from "Turn Stream Deck Off/On" and "Toggle Stream Deck On/Off" to "Macro Pad: Turn Off / Turn On / Toggle On/Off". On Mirabox/AJAZZ and Loupedeck hardware there is no separate power switch: "off" sets the panel brightness to 0 and "on" restores the brightness that was used before. Non-Elgato macro pads require macOS 13.0 or later. */
  MACRO_PAD_TURN_OFF_TURN_ON_TOGGLE: 349,
  /** Show/Hide Stream Deck Emulator — Controls Stream Deck emulator window. */
  SHOW_HIDE_STREAM_DECK_EMULATOR: 365,
  /** Activate Stream Deck Touch Screen Group — Activates touch screen configuration on Stream Deck+. */
  ACTIVATE_STREAM_DECK_TOUCH_SCREEN_GROUP: 376,
  /** Temporarily Change Stream Deck Item — Temporarily changes display of Stream Deck button. */
  TEMPORARILY_CHANGE_STREAM_DECK_ITEM: 377,
  /** Show Floating Menu — Shows a specific floating menu. */
  SHOW_FLOATING_MENU: 386,
  /** Hide Floating Menu — Hides a specific floating menu. */
  HIDE_FLOATING_MENU: 387,
  /** Toggle Floating Menu — Toggles visibility of floating menu. */
  TOGGLE_FLOATING_MENU: 388,
  /** Open Floating Menu Submenu — Opens a submenu in floating menu. You can specify the target either by item UUID, or by menu name + item name. It also enters that submenu on macro pads driven by a floating menu (macOS 13.0+); the optional `BTTMenuActionMacroPadDevice` key limits this to one pad (empty = all such pads, otherwise a device serial number, `model:<modelKey>` for every device of one model, or `family:<familyKey>` for a whole brand - `elgato`, `elgato-plugin-mode`, `mirabox`, `loupedeck`). */
  OPEN_FLOATING_MENU_SUBMENU: 472,
  /** Close Floating Menu Submenu — Closes current floating menu submenu. You can optionally provide the parent menu name or UUID. If no identifier is provided, all open submenus will be closed. It also leaves the current submenu on macro pads driven by a floating menu (macOS 13.0+); the optional `BTTMenuActionMacroPadDevice` key limits this to one pad (empty = all such pads, otherwise a device serial number, `model:<modelKey>` for every device of one model, or `family:<familyKey>` for a whole brand - `elgato`, `elgato-plugin-mode`, `mirabox`, `loupedeck`). */
  CLOSE_FLOATING_MENU_SUBMENU: 445,
  /** Floating Menu Execute JavaScript — Executes JavaScript in a floating menu web view item. Target the item by UUID, or by menu name + item name. */
  FLOATING_MENU_EXECUTE_JAVASCRIPT: 398,
  /** Floating Menu Load HTML — Loads HTML or URL into a floating menu web view item. Target the item by UUID, or by menu name + item name. */
  FLOATING_MENU_LOAD_HTML: 397,
  /** Floating Menu Evaluate Scripts — Re-evaluates all scripts in a floating menu. */
  FLOATING_MENU_EVALUATE_SCRIPTS: 389,
  /** Floating Menu Re-evaluate Position — Recalculates floating menu position based on its positioning configuration. */
  FLOATING_MENU_RE_EVALUATE_POSITION: 390,
  /** Floating Menu Bring to Mouse Screen — Moves floating menu to the screen where the mouse cursor is located. */
  FLOATING_MENU_BRING_TO_MOUSE_SCREEN: 399,
  /** Trigger Floating Menu Highlighted Item — Triggers the currently highlighted menu item in a floating menu. */
  TRIGGER_FLOATING_MENU_HIGHLIGHTED_ITEM: 393,
  /** Trigger Highlighted Item and Hide Menu — Triggers the currently highlighted item and then hides the menu. */
  TRIGGER_HIGHLIGHTED_ITEM_AND_HIDE_MENU: 404,
  /** Trigger Specific Floating Menu Item — Executes a floating menu item exactly like clicking it (runs the item's assigned actions). This is the default action of per-item floating menu triggers (`BTTActionCategory` 50) - assigned to such a trigger without further configuration it executes the trigger's parent menu item. */
  TRIGGER_SPECIFIC_FLOATING_MENU_ITEM: 603,
  /** Floating Menu Hover/Unhover — Controls hover state of a floating menu item. */
  FLOATING_MENU_HOVER_UNHOVER: 394,
  /** Update Floating Menu Item Properties — Dynamically updates properties of a floating menu item at runtime. This is configured through the floating menu item property editor in BTT preferences. */
  UPDATE_FLOATING_MENU_ITEM_PROPERTIES: 447,
  /** Update Floating Menu Properties — Dynamically updates properties of a floating menu itself at runtime. This is configured through the floating menu property editor in BTT preferences. */
  UPDATE_FLOATING_MENU_PROPERTIES: 450,
  /** Reset Floating Menu Item Properties — Resets dynamically changed item properties back to their defaults. Right-click an item in BTT to copy its UUID. If no UUID is provided, the action applies to the item this action is assigned to. */
  RESET_FLOATING_MENU_ITEM_PROPERTIES: 451,
  /** Run Floating Menu Content Scripts — Executes content scripts in a floating menu (re-runs shell scripts, AppleScripts, etc. assigned to menu items). */
  RUN_FLOATING_MENU_CONTENT_SCRIPTS: 469,
  /** Toggle Attach / Pin Floating Menu To Active Window — Attaches or detaches a floating menu to/from the currently active window, so the menu moves with the window. */
  TOGGLE_ATTACH_PIN_FLOATING_MENU_TO_ACTIVE_WINDOW: 548,
  /** Delay (Async / Non-Blocking) — This action pauses the execution of the current action sequence but allows the BTT process to continue processing other stuff. Usually you'd use this action to add some delays to your action sequences, e.g. when waiting for some UI to react. If you need longer timeouts (e.g. to trigger something after 10 minutes) use the "Trigger Action Sequence After Timeout" action instead. */
  DELAY_ASYNC_NON_BLOCKING: 345,
  /** Delay (Blocking) — This one freezes the BTT process for the specified amount of time, preventing any action processing during that time. You should only ever use this with small delays. */
  DELAY_BLOCKING: 129,
  /** Start Repeat — This marks the start of a for loop / repeat. All actions that come between this and the "End / Stop Repeat" action will be repeated. */
  START_REPEAT: 329,
  /** End / Stop Repeat — Marks the end of the repeat / for loop. */
  END_STOP_REPEAT: 332,
  /** Break — Can only be used between "Start Repeat" and "End/Stop Repeat". Behaves like a standard break e.g. in JavaScript: the rest of the current iteration is skipped, the loop ends and execution continues after the matching "End / Stop Repeat". With nested loops it breaks the innermost loop the Break action is placed in. */
  BREAK: 331,
  /** Cancel Repeat — This will cancel the specified repeat loop (if it is running). Like "Break", the rest of the current iteration of that loop is skipped and the sequence continues after the loop's "End / Stop Repeat". Can also be used from a different trigger / action sequence than the loop itself. */
  CANCEL_REPEAT: 424,
  /** IF Condition — Starts conditional block based on variable. */
  IF_CONDITION: 330,
  /** IF JavaScript True — Conditional based on JavaScript evaluation (BTT's built-in Core JavaScript engine, same as "Run Core JavaScript"). The script is evaluated asynchronously; the If block continues once the script has delivered its result. Booleans and the strings "true" / "false" are accepted, anything else counts as false. */
  IF_JAVASCRIPT_TRUE: 431,
  /** IF Image Visible — Conditional based on image visibility on screen. */
  IF_IMAGE_VISIBLE: 405,
  /** IF Text Visible — Conditional based on text visibility on screen. */
  IF_TEXT_VISIBLE: 428,
  /** ELSE — Else clause for IF conditions. Optional; only the first ELSE on a level is honoured (actions after a second ELSE on the same level never run). */
  ELSE: 333,
  /** END IF — Ends conditional block. Required for every IF action. */
  END_IF: 334,
  /** Execute Action Sequence After Timeout (Cancellable) — This allows to execute an action sequence after a specific amount of time. While the previously described delay actions are only meant to be used for short delays, this one can also be used for longer delays. Additionally you can specify a name for the timer, which allows you to cancel it if necessary. */
  EXECUTE_ACTION_SEQUENCE_AFTER_TIMEOUT_CANCELLABLE: 351,
  /** Cancel Timed / Delayed Action Sequences — Cancels the execution of action sequences that has been scheduled via predefined action "Execute Action Sequence After Timeout (Cancellable)". */
  CANCEL_TIMED_DELAYED_ACTION_SEQUENCES: 352,
  /** Ask For Input & Save To Variable — Shows a floating input field and saves the entered text into a variable. */
  ASK_FOR_INPUT_AND_SAVE_TO_VARIABLE: 403,
  /** Wait for Keyboard Input — This will pause the currently executing action sequence until the specified continue or cancel key has been pressed. */
  WAIT_FOR_KEYBOARD_INPUT: 486,
  /** Wait for Conditions To Become True — This will pause the currently executing action sequence until the specified conditions have been met. */
  WAIT_FOR_CONDITIONS_TO_BECOME_TRUE: 417,
  /** Cancel Wait for Conditions To Become True — This will cancel a wait for conditions action. */
  CANCEL_WAIT_FOR_CONDITIONS_TO_BECOME_TRUE: 418,
  /** Continue With Next Action — Continues to next action in sequence. */
  CONTINUE_WITH_NEXT_ACTION: 366,
  /** Stop All Action Sequences — Stops all running action sequences. */
  STOP_ALL_ACTION_SEQUENCES: 531,
  /** Wait For App Launch/Terminate — Waits for app state changes. */
  WAIT_FOR_APP_LAUNCH_TERMINATE: 413,
  /** Wait For Image to Become Visible — Waits for image to appear on screen. */
  WAIT_FOR_IMAGE_TO_BECOME_VISIBLE: 419,
  /** Wait For Focus Change — Waits for window focus to change. */
  WAIT_FOR_FOCUS_CHANGE: 423,
  /** Wait For Other BetterTouchTool Trigger To Fire — Pauses the action sequence and waits until a specific trigger (identified by UUID) fires. If the trigger doesn't fire within the timeout, the wait is cancelled. */
  WAIT_FOR_OTHER_BETTERTOUCHTOOL_TRIGGER_TO_FIRE: 567,
  /** Debounce — Only continues the action sequence if the last execution has been more than X seconds ago. Useful to prevent rapid repeated execution of expensive actions. */
  DEBOUNCE: 579,
  /** Set Variable — Sets a persistent or temporary variable. */
  SET_VARIABLE: 292,
  /** Increase Variable — Increases numeric variable value. */
  INCREASE_VARIABLE: 412,
  /** Toggle Variable — Toggles variable between values. */
  TOGGLE_VARIABLE: 335,
  /** Toggle On/Off — Simple on/off toggle for variable. */
  TOGGLE_ON_OFF: 346,
  /** Refresh Condition Values — Re-evaluates all condition-based variables. */
  REFRESH_CONDITION_VALUES: 350,
  /** Show Variables View — Shows window with all current variables. */
  SHOW_VARIABLES_VIEW: 523,
  /** Connect Bluetooth Device — Connects to a Bluetooth device. */
  CONNECT_BLUETOOTH_DEVICE: 274,
  /** Disconnect Bluetooth Device — Disconnects a Bluetooth device. */
  DISCONNECT_BLUETOOTH_DEVICE: 275,
  /** Toggle Bluetooth Device — Toggles Bluetooth device connection. */
  TOGGLE_BLUETOOTH_DEVICE: 276,
  /** Enable Bluetooth — Enables Bluetooth on the system. */
  ENABLE_BLUETOOTH: 277,
  /** Disable Bluetooth — Disables Bluetooth on the system. */
  DISABLE_BLUETOOTH: 278,
  /** Toggle Bluetooth — Toggles Bluetooth on/off. */
  TOGGLE_BLUETOOTH: 279,
  /** Connect MIDI Device — Connects to a MIDI device. */
  CONNECT_MIDI_DEVICE: 271,
  /** Send MIDI Command — Sends a MIDI command to a connected MIDI device / endpoint. */
  SEND_MIDI_COMMAND: 462,
  /** Send OSC Message — Sends an Open Sound Control (OSC) message to a UDP host/port. Arguments are provided as a JSON array. */
  SEND_OSC_MESSAGE: 602,
  /** Send Raw Data to Generic Device — Sends raw data to connected device. */
  SEND_RAW_DATA_TO_GENERIC_DEVICE: 379,
  /** Execute Generic Device Command — Executes command on generic device. */
  EXECUTE_GENERIC_DEVICE_COMMAND: 380,
  /** Connect Sidecar — Connects iPad as Sidecar display. */
  CONNECT_SIDECAR: 506,
  /** Disconnect Sidecar — Disconnects Sidecar display. */
  DISCONNECT_SIDECAR: 507,
  /** BTT Mobile Actions — Controls BTT Mobile companion app. */
  BTT_MOBILE_ACTIONS: 453,
  /** Siri Remote Mouse Mode — Controls Siri Remote mouse mode. */
  SIRI_REMOTE_MOUSE_MODE: 166,
  /** Logitech: Change Mouse DPI — Changes the DPI (sensitivity) setting of a Logitech mouse (e.g. MX Master). */
  LOGITECH_CHANGE_MOUSE_DPI: 554,
  /** Logitech: Change Smart Shift / Ratchet Mode / Scroll Settings — Changes smart shift, ratchet mode, and scroll settings of a Logitech mouse. */
  LOGITECH_CHANGE_SMART_SHIFT_RATCHET_MODE_SCROLL_SETTINGS: 555,
  /** Logitech: Change LED Color — Changes the LED color of a Logitech device. */
  LOGITECH_CHANGE_LED_COLOR: 556,
  /** Logitech: Change Report Rate — Changes the report rate (polling rate in Hz) of a Logitech mouse. */
  LOGITECH_CHANGE_REPORT_RATE: 557,
  /** Logitech: Change Profile — Switches the onboard profile of a Logitech device. */
  LOGITECH_CHANGE_PROFILE: 558,
  /** Logitech: Increase / Decrease Keyboard Brightness — Increases or decreases the keyboard backlight brightness of a Logitech keyboard. */
  LOGITECH_INCREASE_DECREASE_KEYBOARD_BRIGHTNESS: 561,
  /** Logitech: Increase / Decrease Mouse DPI — Incrementally increases or decreases the mouse DPI by a scale factor. */
  LOGITECH_INCREASE_DECREASE_MOUSE_DPI: 563,
  /** Logitech: Toggle Ratchet Mode — Toggles the scroll wheel ratchet mode (free-spin vs. ratchet) of a Logitech mouse. */
  LOGITECH_TOGGLE_RATCHET_MODE: 565,
  /** Logitech: Haptic Feedback — Triggers haptic feedback on a supported Logitech mouse (MX Master 4 only). */
  LOGITECH_HAPTIC_FEEDBACK: 566,
  /** Logitech: Change Host / Channel — Switches the active host/channel (1-3) on a multi-device Logitech device. */
  LOGITECH_CHANGE_HOST_CHANNEL: 568,
  /** Find Position of Image on Screen — Finds image on screen and optionally clicks it. */
  FIND_POSITION_OF_IMAGE_ON_SCREEN: 291,
  /** Start/Stop Scroll Blocking — Blocks scroll events from reaching apps. */
  START_STOP_SCROLL_BLOCKING: 381,
  /** Zoom (Pinch) — Performs zoom/pinch gesture. */
  ZOOM_PINCH: 478,
  /** Rotate — Performs rotation gesture. */
  ROTATE: 479,
  /** Smart Zoom — Performs smart zoom (double tap with two fingers). */
  SMART_ZOOM: 117,
  /** Look Up — Shows definition/info for selected text. */
  LOOK_UP: 116,
  /** Show Context Menu — Shows context menu at current position. */
  SHOW_CONTEXT_MENU: 288,
  /** Show Context Menu for Selection — Shows context menu for selected text. */
  SHOW_CONTEXT_MENU_FOR_SELECTION: 353,
  /** Trigger Menu Bar Item — Clicks a menu bar menu item. */
  TRIGGER_MENU_BAR_ITEM: 124,
  /** Trigger Context Menu Item — Clicks item in context menu. */
  TRIGGER_CONTEXT_MENU_ITEM: 162,
  /** Click Status Bar Item — Clicks a status bar item. */
  CLICK_STATUS_BAR_ITEM: 375,
  /** Show/Hide Status Bar Items — Controls visibility of status bar items. */
  SHOW_HIDE_STATUS_BAR_ITEMS: 265,
  /** Move Status Bar Item — Moves status bar item to new position. */
  MOVE_STATUS_BAR_ITEM: 459,
  /** Search Menu Bar Status Items — Opens search for status bar items. */
  SEARCH_MENU_BAR_STATUS_ITEMS: 464,
  /** Click Button in Active Window — Clicks a button by name in active window. */
  CLICK_BUTTON_IN_ACTIVE_WINDOW: 520,
  /** Change Slider Value — Changes the value of a slider with the given name in the active window/dialog, either relatively (default) or absolutely. */
  CHANGE_SLIDER_VALUE: 521,
  /** Interact with UI Element — Generic UI element interaction using accessibility (AX) paths. */
  INTERACT_WITH_UI_ELEMENT: 522,
  /** Show UI Element Viewers — Shows debugging viewers for UI elements. */
  SHOW_UI_ELEMENT_VIEWERS: 503,
  /** Get Hovered Link/URL — Gets link or URL under mouse cursor. */
  GET_HOVERED_LINK_URL: 526,
  /** Start/End Keyboard Input Blocking — Blocks keyboard input from reaching apps. */
  START_END_KEYBOARD_INPUT_BLOCKING: 429,
  /** Lock Mouse Axis Movement — Locks mouse movement to specific axis. */
  LOCK_MOUSE_AXIS_MOVEMENT: 533,
  /** Start / Stop Smooth Scroll — Starts or stops continuous smooth scrolling. Can be used to simulate touchpad-like smooth scrolling. */
  START_STOP_SMOOTH_SCROLL: 569,
  /** Start / Stop Smooth Zoom — Starts or stops continuous smooth zooming (pinch zoom gesture simulation). */
  START_STOP_SMOOTH_ZOOM: 571,
  /** Start / Stop Smooth Rotate — Starts or stops continuous smooth rotation (rotation gesture simulation). */
  START_STOP_SMOOTH_ROTATE: 573,
  /** Start / Stop Smooth Space Switch — Starts or stops smooth space switching animation (smooth horizontal desktop transition). */
  START_STOP_SMOOTH_SPACE_SWITCH: 575,
  /** Start Dictation / Speech Recognition — Starts recognizing and transcribing speech using macOS speech recognition. Requires macOS 26+ and microphone permission. All settings live in `actionData`. */
  START_DICTATION_SPEECH_RECOGNITION: 576,
  /** Stop Dictation & Paste or Copy — Stops speech recognition and pastes or copies the transcribed text. Vocabulary and replacements are taken from the action that started the recognition. */
  STOP_DICTATION_AND_PASTE_OR_COPY: 577,
  /** Show Custom Context Menu — Shows a custom context menu with items. */
  SHOW_CUSTOM_CONTEXT_MENU: 327,
  /** Show Custom HTML Menu — Shows menu with HTML content. */
  SHOW_CUSTOM_HTML_MENU: 339,
  /** Show Searchable List — Shows a searchable list of items. Items can be provided statically or retrieved dynamically from a script. */
  SHOW_SEARCHABLE_LIST: 465,
  /** Show Floating Web View — Shows floating window with web content. */
  SHOW_FLOATING_WEB_VIEW: 249,
  /** Close Floating Web View — Closes floating web view window. */
  CLOSE_FLOATING_WEB_VIEW: 372,
  /** Show HUD — Shows a heads-up display overlay with a message. */
  SHOW_HUD: 254,
  /** Show Notification — Shows system notification. */
  SHOW_NOTIFICATION: 371,
  /** Haptic Feedback — Triggers haptic feedback on trackpad. Supports built-in patterns and custom haptic presets. */
  HAPTIC_FEEDBACK: 255,
  /** Show Color Picker — Shows the color picker dialog. */
  SHOW_COLOR_PICKER: 94,
  /** Show Cheat Sheet — Shows the cheat sheet (an overview of the triggers configured in BTT). Which triggers are included is configured via a trigger-selection dictionary; the cheat sheet's visual appearance is configured in the BTT preferences, not per action. */
  SHOW_CHEAT_SHEET: 354,
  /** Hide/Toggle Cheat Sheet — Controls cheat sheet visibility. */
  HIDE_TOGGLE_CHEAT_SHEET: 356,
  /** Open URL — Opens URL in default browser. */
  OPEN_URL: 59,
  /** Post Distributed Notification — Posts a system-wide notification. */
  POST_DISTRIBUTED_NOTIFICATION: 136,
  /** Change Input Source — Changes keyboard input source/language. */
  CHANGE_INPUT_SOURCE: 420,
  /** Change Default Browser — Changes system default browser. */
  CHANGE_DEFAULT_BROWSER: 492,
  /** Set Function Key Mode — Sets function key behavior. */
  SET_FUNCTION_KEY_MODE: 436,
  /** Call macOS Service — Calls a macOS service by name. */
  CALL_MACOS_SERVICE: 435,
  /** Set Icon for File — Sets custom icon for file/folder/app. */
  SET_ICON_FOR_FILE: 473,
  /** Create Snap Area — Creates a new window snap area. */
  CREATE_SNAP_AREA: 391,
  /** Edit Snap Areas — Opens snap area editor. */
  EDIT_SNAP_AREAS: 392,
  /** Trigger Snap Area — Triggers specific snap area. */
  TRIGGER_SNAP_AREA: 168,
  /** Plugin Action — Executes a BTT plugin action. */
  PLUGIN_ACTION: 280,
  /** JSON Action Plugin — Executes a JSON-based action plugin (.bttjsonplugin). JSON plugins are simple JSON files that define actions with configurable form fields and placeholder substitution. They do not require compiled code — just a .bttjsonplugin file placed in the BetterTouchTool Plugins folder. */
  JSON_ACTION_PLUGIN: 588,
  /** Comment — No-op action for adding comments in action sequences. */
  COMMENT: 490,
  /** Separator — Visual separator in action lists. */
  SEPARATOR: 323,
  /** AI Actions — AI-related actions for ChatGPT integration. */
  AI_ACTIONS: 530,
  /** AI Chat Window — Opens an AI chat window with customizable settings. */
  AI_CHAT_WINDOW: 999,
  /** h@llo.ai - Show Customizable AI Assistant — Shows the customizable h@llo.ai (hello.ai) AI assistant window. */
  H_LLO_AI_SHOW_CUSTOMIZABLE_AI_ASSISTANT: 525,
  /** h@llo.ai - Update AI Chat Properties — Updates properties of an active h@llo.ai chat session. */
  H_LLO_AI_UPDATE_AI_CHAT_PROPERTIES: 538,
  /** h@llo.ai - Cancel All Ongoing Requests — Cancels all ongoing h@llo.ai AI requests. */
  H_LLO_AI_CANCEL_ALL_ONGOING_REQUESTS: 541,
  /** h@llo.ai - Close All Assistant Windows — Closes all open h@llo.ai assistant windows. */
  H_LLO_AI_CLOSE_ALL_ASSISTANT_WINDOWS: 542,
  /** h@llo.ai - Run AI Task In Background — Runs an AI task in the background without showing a window. */
  H_LLO_AI_RUN_AI_TASK_IN_BACKGROUND: 581,
  /** Codex Controller - Start Task — Starts a new Codex task. */
  CODEX_CONTROLLER_START_TASK: 605,
  /** Codex Controller - Send Message To Task — Sends a message to an existing Codex task. */
  CODEX_CONTROLLER_SEND_MESSAGE_TO_TASK: 606,
  /** Codex Controller - Stop Active Turn — Stops the currently running turn of a Codex task. */
  CODEX_CONTROLLER_STOP_ACTIVE_TURN: 607,
  /** Codex Controller - Fork Task — Forks an existing Codex task into a new one. */
  CODEX_CONTROLLER_FORK_TASK: 608,
  /** Codex Controller - Open Task In Codex — Opens a task in the Codex app. */
  CODEX_CONTROLLER_OPEN_TASK_IN_CODEX: 609,
  /** Codex Controller - Approve Pending Request — Approves a pending Codex approval request. */
  CODEX_CONTROLLER_APPROVE_PENDING_REQUEST: 610,
  /** Codex Controller - Decline Pending Request — Declines a pending Codex approval request. */
  CODEX_CONTROLLER_DECLINE_PENDING_REQUEST: 611,
  /** Codex Controller - Refresh Tasks — Refreshes the Codex task list / snapshot data. */
  CODEX_CONTROLLER_REFRESH_TASKS: 612,
  /** Codex Controller - Set Active Task — Selects the task targeted by the shared control items in a Floating Menu and opens that task in the Codex app. It does not start a turn. */
  CODEX_CONTROLLER_SET_ACTIVE_TASK: 613,
  /** Codex Controller - Agent Key — Reproduces a Codex Micro Agent Key as one composable action. The first tap selects and navigates to the task without activating Codex. A second tap on the same key within the macOS double-click interval opens the task and brings Codex front and center. Selecting a completed task acknowledges its green completion state and returns it to idle. */
  CODEX_CONTROLLER_AGENT_KEY: 614,
  /** Show Launcher — Shows the BetterTouchTool Launcher. Requires macOS 13.0 or later. Supports optional positioning configuration to control where the launcher window appears. You can also set a stable launcher ID so multiple actions target the same launcher instance. In "Move & Resize Freely" mode (default), BetterTouchTool remembers the last position per launcher ID when one is set, otherwise it keeps the legacy per-trigger behavior. */
  SHOW_LAUNCHER: 594,
  /** Hide Launcher — Hides the BetterTouchTool Launcher. Requires macOS 13.0 or later. You can optionally target a specific launcher instance via `BTTActionLauncherID`. If no launcher ID is provided, BetterTouchTool hides the currently active launcher. */
  HIDE_LAUNCHER: 595,
  /** Toggle Launcher — Toggles the BetterTouchTool Launcher visibility. Requires macOS 13.0 or later. Supports the same optional positioning configuration as Show Launcher to control where the launcher window appears, including stable launcher IDs and the optional `BTTActionLauncherInitialRoute` (or legacy `BTTActionLauncherOpenGroup`) to open a specific Launcher item or group immediately. */
  TOGGLE_LAUNCHER: 596,
  /** Stage Manager Actions — Controls macOS Stage Manager. */
  STAGE_MANAGER_ACTIONS: 357,
  /** Dock Actions — Performs actions on dock items. */
  DOCK_ACTIONS: 145,
  /** Toggle Actions — Various toggle actions. */
  TOGGLE_ACTIONS: 140,
  /** Gesture Control — Controls for trackpad/mouse gestures. */
  GESTURE_CONTROL: 75,
  /** Zoom In/Out — System zoom controls. */
  ZOOM_IN_OUT: 11,
  /** Window Snapping — Split screen and window snapping. */
  WINDOW_SNAPPING: 163,
  /** Fullscreen — Fullscreen control. */
  FULLSCREEN: 112,
  /** No Action — Placeholder that performs no action. */
  NO_ACTION: -1,
  /** Send Data to Connected BTT Mobile/iOS Device — Sends data to a connected BetterTouchTool mobile device. */
  SEND_DATA_TO_CONNECTED_BTT_MOBILE_IOS_DEVICE: 285,
  /** Dock App Click: Activate / Restore / Minimize — Smart Dock-icon click handling for the application under the mouse cursor. Activates the app and raises/restores its windows if it is hidden or all of its windows are minimized; otherwise it minimizes or hides it. Only works while the mouse is over an application icon in the macOS Dock (typically assigned to a Dock icon trigger or a mouse click). */
  DOCK_APP_CLICK_ACTIVATE_RESTORE_MINIMIZE: 601,
  /** Macro Pad: Show Menu / Next Page / Previous Page — Navigation actions for macro pads that are driven by a floating menu (Elgato Stream Deck, the Mirabox / AJAZZ "Stream Dock" family and Loupedeck / Razer Stream Controller). These replace the old "Open / Close Stream Deck Group" workflow: "Show Menu" retargets a pad at a different floating menu at runtime, the page actions move through the pages of the menu currently shown on the pad. To enter or leave a submenu on a pad, use "Open Floating Menu Submenu" (472) / "Close Floating Menu Submenu" (445) - those actions apply to macro pads too. Requires macOS 13.0 or later. */
  MACRO_PAD_SHOW_MENU_NEXT_PAGE_PREVIOUS_PAGE: 618,
  /** Ignore Built-In Trackpad While Mouse Present — Enables, disables or toggles the macOS setting "Ignore built-in trackpad when mouse or wireless trackpad is present" (System Settings => Accessibility => Pointer Control). The change applies immediately, no logout is necessary. This is a system wide setting, so it stays in effect until it is changed again - also after quitting BetterTouchTool. It only has an effect on Macs that have a built-in trackpad. The current state is available in the `ignore_builtin_trackpad_active` variable, which can also be used as a condition in conditional activation groups. */
  IGNORE_BUILT_IN_TRACKPAD_WHILE_MOUSE_PRESENT: 625,
} as const;

export type ActionTypeName = keyof typeof ActionType;
export type ActionTypeId = (typeof ActionType)[ActionTypeName];
