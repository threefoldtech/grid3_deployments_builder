import { writable } from "svelte/store";

const notifications = writable([]);

function addNotification(notification) {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  const id = Math.floor(Math.random() * 10000);
  // Setup some sensible defaults for a notification.
  const defaults = {
    id,
    type: "info",
    dismissible: true,
    timeout: 3000,
  };

  // Push the notification to the top of the list of notifications
  notifications.update((all) => [{ ...defaults, ...notification }, ...all]);

  // If notification is dismissible, dismiss it after "timeout" amount of time.
  if (notification.timeout)
    setTimeout(() => dismissNotification(id), notification.timeout);
}

function addInfoNotification(msg) {
  return addNotification({
    message: msg,
    type: "info",
    dismissible: true,
    timeout: 3000,
  });
}

function addSuccessNotification(msg) {
  return addNotification({
    message: msg,
    type: "success",
    dismissible: true,
    timeout: 3000,
  });
}

function addErrorNotification(msg) {
  return addNotification({
    message: msg,
    type: "error",
    dismissible: true,
    timeout: 3000,
  });
}

function dismissNotification(id) {
  notifications.update((all) => all.filter((t) => t.id !== id));
}

function updateLastNotification(msg) {
  notifications.update((all) => {
    const id = Math.floor(Math.random() * 10000);
    let newNotification = {
      id,
      message: msg,
      type: "",
      dismissible: true,
      timeout: 3000,
    };
    const lastNotification = all.splice(0, 1);
    newNotification.type = lastNotification["type"] || "loading";
    all.unshift(newNotification);
    if (newNotification.timeout)
      setTimeout(() => dismissNotification(id), newNotification.timeout);
    return all;
  });
}

export {
  notifications,
  addNotification,
  addSuccessNotification,
  addInfoNotification,
  addErrorNotification,
  dismissNotification,
  updateLastNotification,
};
