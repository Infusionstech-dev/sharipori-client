// The success page needs the order's details, but guests cannot load an order by number.
// Checkout leaves a copy here for that one page. sessionStorage ends with the tab.
const KEY = "ss_last_order";

export function saveLastOrder(order) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // The success page still shows the order number.
  }
}

export function loadLastOrder(orderNo) {
  try {
    const order = JSON.parse(window.sessionStorage.getItem(KEY));
    return order?.orderNo === orderNo ? order : null;
  } catch {
    return null;
  }
}

// Returns true only the first time it is called for an order, so tracking fires once.
export function firstTimeFor(orderNo, purpose) {
  const key = `ss_${purpose}_${orderNo}`;
  try {
    if (window.sessionStorage.getItem(key)) {
      return false;
    }
    window.sessionStorage.setItem(key, "1");
    return true;
  } catch {
    return false;
  }
}
