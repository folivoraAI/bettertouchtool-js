// Update a floating menu item's text/color, then show the menu.
import { Btt, actions } from "bettertouchtool";
const btt = Btt.socket();
await btt.updateMenuItem(
  { menuName: "Quick Actions", itemName: "Status" },
  {
    BTTMenuItemText: "All systems go",
    BTTMenuItemBackgroundColor: "20, 200, 20, 255",
  },
);
await btt.triggerAction(actions.showFloatingMenu("Quick Actions"));
