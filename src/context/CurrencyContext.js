import { createContext, useReducer } from "react";

export const CurrencyContext = createContext();

export const CurrencyReducer = (state, action) => {
  switch (action.type) {
    case "SET_CURRENCY":
      return {
        currency: action.payload,
      };
    default:
      return state;
  }
};

export const CurrencyContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CurrencyReducer, {
    currency: {label:"EURO", value:"eur", symbol:"€"},
  });

  return (
    <CurrencyContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CurrencyContext.Provider>
  );
};
