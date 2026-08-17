// Updates a menubar item every second with the current time. Get the uuid by right-clicking the item in BTT.
import { Btt } from "bettertouchtool";
const btt = Btt.socket();
const item = btt.widget(process.argv[2] ?? "PUT-MENUBAR-ITEM-UUID-HERE", "menubar");
setInterval(() => item.update({ text: new Date().toLocaleTimeString() }), 1000);
