import { Provider } from "react-redux";
import { store } from "../store";
import Counter from "../features/counter/counter";

export function CounterPage() {
  return (
    <Provider store={store}>
      <h1>Counter Demo</h1>
      <Counter />
    </Provider>
  );
}
