#! /usr/bin/env node

/**
 * @file
 * @author Carl Gross
 */

import { notificationModule } from "../client/notification_system/notification_system.js";
console.log("Running notification system.");
notificationModule.main();
