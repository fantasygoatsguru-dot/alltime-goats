import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GoogleAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Push page view event to dataLayer on route change
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "pageview",
            page: location.pathname + location.search,
        });
    }, [location]);

    return null;
};

export default GoogleAnalytics;