
export const trackPageView = (path) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "pageview",
        page: path,
    });
};

export const trackEvent = (category, action, label) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "gaEvent", // Custom event name (configure in GTM)
        category,
        action,
        label,
    });
};

// Track exceptions
export const trackException = (description = "", fatal = false) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: "gaException", // Custom event name (configure in GTM)
        description,
        fatal,
    });
};