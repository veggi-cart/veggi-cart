import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../../../api/api.client";

// Fallback values — used while fetching or if the request fails
const DEFAULTS = { deliveryCharge: 40, freeDeliveryThreshold: 500 };

const DeliveryConfigContext = createContext(DEFAULTS);

export const DeliveryConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULTS);

  useEffect(() => {
    apiClient
      .get("/settings")
      .then((res) => {
        const { deliveryCharge, freeDeliveryThreshold } = res.data?.data ?? {};
        if (deliveryCharge != null && freeDeliveryThreshold != null) {
          setConfig({ deliveryCharge, freeDeliveryThreshold });
        }
      })
      .catch(() => {
        // Keep defaults silently — non-critical
      });
  }, []);

  return (
    <DeliveryConfigContext.Provider value={config}>
      {children}
    </DeliveryConfigContext.Provider>
  );
};

export const useDeliveryConfig = () => useContext(DeliveryConfigContext);
