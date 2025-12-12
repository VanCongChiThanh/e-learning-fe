import { useEffect, useRef, useState, useCallback } from "react";

export const useChatbot = (config = {}) => {
  const widgetRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const defaultConfig = {
    apiUrl: process.env.REACT_APP_CHATBOT_API || "http://localhost:8000",
    position: "right",
    theme: "light",
    title: "Trợ lý AI",
    subtitle: "Xin chào! Tôi có thể giúp gì cho bạn?",
    primaryColor: "#106c54",
    secondaryColor: "#106c54",
    ...config,
  };

  const openWidget = useCallback(() => {
    if (widgetRef.current) {
      widgetRef.current.open();
      setIsOpen(true);
    }
  }, []);

  const closeWidget = useCallback(() => {
    if (widgetRef.current) {
      widgetRef.current.close();
      setIsOpen(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    if (widgetRef.current) {
      widgetRef.current.clearHistory();
    }
  }, []);

  const getHistory = useCallback(() => {
    return widgetRef.current ? widgetRef.current.getHistory() : [];
  }, []);

  useEffect(() => {
    if (!config && config !== undefined) return;

    let existingScript = document.querySelector(
      'script[src*="chatbot-widget.js"]'
    );

    const initWidget = () => {
      if (window.ChatbotWidget && !widgetRef.current) {
        try {
          widgetRef.current = window.ChatbotWidget.init(defaultConfig);

          if (widgetRef.current) {
            widgetRef.current.onOpen = () => setIsOpen(true);
            widgetRef.current.onClose = () => setIsOpen(false);

            if (defaultConfig.onMessage) {
              widgetRef.current.onMessage = defaultConfig.onMessage;
            }
            if (defaultConfig.onError) {
              widgetRef.current.onError = defaultConfig.onError;
            }
          }

          setIsLoaded(true);
        } catch (error) {
          console.error("Failed to initialize chatbot:", error);
        }
      }
    };

    if (existingScript) {
      initWidget();
    } else {
      const script = document.createElement("script");
      script.src = "/js/chatbot-widget.js";
      script.async = true;

      script.onload = () => {
        initWidget();
      };

      script.onerror = () => {
        console.error("Failed to load chatbot script");
      };

      document.head.appendChild(script);
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.destroy();
        widgetRef.current = null;
        setIsLoaded(false);
        setIsOpen(false);
      }
    };
  }, [defaultConfig.apiUrl]);

  return {
    widget: widgetRef.current,
    isLoaded,
    isOpen,
    openWidget,
    closeWidget,
    clearHistory,
    getHistory,
  };
};
