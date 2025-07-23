/* eslint-disable react-refresh/only-export-components */
import { createContext, memo, type PropsWithChildren, useContext, useReducer } from "react";
import { createPortal } from "react-dom";
import { Toast } from "./Toast";
import { createActions, initialState, toastReducer, type ToastType } from "./toastReducer";
import { debounce } from "../../utils";

type ShowToast = (message: string, type: ToastType) => void;
type Hide = () => void;

const ToastCommandContext = createContext<{
  show: ShowToast;
  hide: Hide;
}>({
  show: () => null,
  hide: () => null,
});

const ToastStateContext = createContext<{
  message: string;
  type: ToastType;
}>({
  ...initialState,
});

const DEFAULT_DELAY = 3000;

const useToastCommandContext = () => useContext(ToastCommandContext);
const useToastStateContexts = () => useContext(ToastStateContext);

export const useToastCommand = () => {
  const { show, hide } = useToastCommandContext();
  return { show, hide };
};
export const useToastState = () => {
  const { message, type } = useToastStateContexts();
  return { message, type };
};

export const ToastProvider = memo(({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);
  const { show, hide } = createActions(dispatch);
  const visible = state.message !== "";

  const hideAfter = debounce(hide, DEFAULT_DELAY);

  const showWithHide: ShowToast = (...args) => {
    show(...args);
    hideAfter();
  };

  return (
    <ToastCommandContext.Provider value={{ show: showWithHide, hide }}>
      <ToastStateContext.Provider value={{ message: state.message, type: state.type }}>
        {children}
        {visible && createPortal(<Toast />, document.body)}
      </ToastStateContext.Provider>
    </ToastCommandContext.Provider>
  );
});
