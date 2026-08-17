// GENERATED FILE — do not edit. Run `npm run generate`.
// Source: BetterTouchTool trigger-definitions.mdx (15 categories, 513 trigger types)

export interface TriggerDefinition {
  /** BTTTriggerType */
  id: number;
  name: string;
  slug: string;
  category: string;
  /** default BTTTriggerClass for this trigger */
  triggerClass: string;
  section?: string;
}

export interface TriggerCategoryDefinition {
  category: string;
  classes: string[];
  triggers: TriggerDefinition[];
}

/** All BTTTriggerClass values. */
export const TriggerClass = {
  TouchpadAll: "BTTTriggerTypeTouchpadAll",
  TouchpadBuiltIn: "BTTTriggerTypeTouchpadBuiltIn",
  TouchpadMagicTrackpad: "BTTTriggerTypeTouchpadMagicTrackpad",
  TouchpadMagicTrackpad2: "BTTTriggerTypeTouchpadMagicTrackpad2",
  TouchBarTrackpad: "BTTTriggerTypeTouchBarTrackpad",
  MagicMouse: "BTTTriggerTypeMagicMouse",
  OtherTriggers: "BTTTriggerTypeOtherTriggers",
  KeyboardShortcut: "BTTTriggerTypeKeyboardShortcut",
  KeySequence: "BTTTriggerTypeKeySequence",
  Drawings: "BTTTriggerTypeDrawings",
  Mouse: "BTTTriggerTypeMouse",
  SiriRemote: "BTTTriggerTypeSiriRemote",
  TouchBar: "BTTTriggerTypeTouchBar",
  StreamDeck: "BTTTriggerTypeStreamDeck",
  NotchBar: "BTTTriggerTypeNotchBar",
  FloatingMenu: "BTTTriggerTypeFloatingMenu",
  MIDI: "BTTTriggerTypeMIDI",
  GenericDevice: "BTTTriggerTypeGenericDevice",
  BTTRemote: "BTTTriggerTypeBTTRemote",
} as const;
export type TriggerClassName = (typeof TriggerClass)[keyof typeof TriggerClass];
