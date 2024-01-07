// ---------------------------------------------------------------- //
// Copyright: Innki Tech 2023. All Rights Reserved                  //
// Mantainer: Helder Manuel <helder.manuel@innki.tech>              //
// This file is licensed under the MPL 2.0 license                  //
// License text available at https://www.mozilla.org/en-US/MPL/2.0  //
// ---------------------------------------------------------------- //

const removeQueryParams = () => {
  // Get URL & URL Path
  const url = new URL(window.location.href);
  const urlPath = url.origin + url.pathname;

  // Change URL (Remove Query Params)
  history.pushState({}, null, urlPath);
};

const loadScript = (script) => {
  const scriptObj = document.createElement('script');

  scriptObj.id = "thrivecart-loader";
  scriptObj.src = script;

  document.body.append(scriptObj);
};

const getParam = (paramKey) => {
  return localStorage.getItem(paramKey);
};

const loadParam = (paramKey, paramReceiver, paramMode) => {
  const paramValue = getParam(paramKey) === null ? '' : getParam(paramKey);

  switch(paramMode) {
    case "input":
      paramReceiver.value = paramValue;
    break;

    case "select":
      paramReceiver.value = paramValue;
    break;
  }
};

const storeParam = (paramKey, paramValue) => {
  return (paramValue) ? localStorage.setItem(paramKey, paramValue) : localStorage.removeItem(paramKey);
};

const storeQueryParam = (queryParamObj, queryParamKey) => {
  const queryParamValue = queryParamObj.get(queryParamKey);

  return (queryParamValue) ? storeParam(queryParamKey, queryParamValue) : null;
};

const validateRefCode = (refCodeMappingTable, refCodeValue) => {
  return Object.keys(refCodeMappingTable).includes(refCodeValue);
};

const storeRefCode = (refCodeValid, refCodeKey, refCodeValue) => {
  return (refCodeValid) ? storeParam(refCodeKey, refCodeValue) : null;
};

const validatePayParams = (payProcessorValue, payFromSpainValue, payTaxExemptionValue) => {
  const payParamValues = [
    payProcessorValue,
    payFromSpainValue
  ]

  if (payFromSpainValue == "yes") payParamValues.push(payTaxExemptionValue);

  return payParamValues.every(item => typeof item === "string");
};

const togglePayTaxExemptionRow = (payTaxExemptionParam, payTaxExemptionToggler) => {
  const payTaxExemptionRowSelector = document.querySelector(`#${payTaxExemptionParam}_block`);
  const toggleDisplayValue         = payTaxExemptionToggler === true ? "block" : "none";
  const toggleMarginTopValue       = payTaxExemptionToggler === true ? "25px" : "0px";

  payTaxExemptionRowSelector.style.setProperty("display", toggleDisplayValue, "important");
  payTaxExemptionRowSelector.style.setProperty("margin-top", toggleMarginTopValue, "important");
};

const toggleThrivecartCheckout = (thrivecartObj, payProcessorParam, payFromSpainParam, payTaxExemptionParam) => {
  const payProcessorValue    = localStorage.getItem(payProcessorParam);
  const payFromSpainValue    = localStorage.getItem(payFromSpainParam);

  if (payFromSpainValue == "yes") {

    thrivecartObj.queryParams["passthrough[customer_address_country]"] = "ES";
    togglePayTaxExemptionRow(payTaxExemptionParam, true);
  } else {

    localStorage.removeItem(payTaxExemptionParam);
    loadParam(payTaxExemptionParam);
    delete thrivecartObj.queryParams["passthrough[customer_address_country]"];
    togglePayTaxExemptionRow(payTaxExemptionParam, false);
  }

  const payTaxExemptionValue = localStorage.getItem(payTaxExemptionParam);

  unmountThrivecartCheckout(thrivecartObj);

  if (validatePayParams(payProcessorValue, payFromSpainValue, payTaxExemptionValue)) {
    mountThrivecartCheckout(thrivecartObj, payProcessorValue, payFromSpainValue, payTaxExemptionValue);
  }
};

const addThrivecartQueryParams = (thrivecartObj) => {
  const thrivecartDiv = document.querySelector(`[data-thrivecart-account="${thrivecartObj.account}"]`);
  const thriveCartQueryParamsObj = new URLSearchParams(thrivecartObj.queryParams).toString();

  thrivecartDiv.setAttribute("data-thrivecart-querystring", thriveCartQueryParamsObj);
};

const mountThrivecartCheckout = (thrivecartObj, payProcessorValue, payFromSpainValue, payTaxExemptionValue) => {
  let checkoutTax = true;

  switch (payTaxExemptionValue) {
    case "canary_islands":
      checkoutTax = false;
      thrivecartObj.queryParams["passthrough[customer_address_state]"] = "Islas Canarias";
      break;
    case "ceuta":
      checkoutTax = false;
      thrivecartObj.queryParams["passthrough[customer_address_state]"] = "Ceuta";
      break;
    case "melilla":
      checkoutTax = false;
      thrivecartObj.queryParams["passthrough[customer_address_state]"] = "Melilla";
      break;
    default:
      delete thrivecartObj.queryParams["passthrough[customer_address_state]"];
      break;
  }

  checkoutTax = checkoutTax ? "t" : "n";
  const thrivecartCheckout = thrivecartObj.checkouts[payProcessorValue][checkoutTax];
  const thrivecartDiv = document.querySelector(`[data-thrivecart-account="${thrivecartObj.account}"]`);

  console.log("Montando Checkout...");
  console.log(thrivecartObj.checkouts[payProcessorValue][checkoutTax])

  thrivecartDiv.setAttribute("data-thrivecart-product", thrivecartCheckout.id);
  addThrivecartQueryParams(thrivecartObj);

  loadScript("//tinder.thrivecart.com/embed/v1/thrivecart.js");
};

const unmountThrivecartCheckout = (thrivecartObj) => {
  console.log("Desmontando Checkout...");
  const thrivecartDiv = document.querySelector(`[data-thrivecart-account="${thrivecartObj.account}"]`);

  thrivecartDiv.innerHTML = "";
};

// Exports
window.removeQueryParams         = removeQueryParams;
window.loadScript                = loadScript;
window.getParam                  = getParam;
window.loadParam                 = loadParam;
window.storeParam                = storeParam;
window.storeQueryParam           = storeQueryParam;
window.validateRefCode           = validateRefCode;
window.storeRefCode              = storeRefCode;
window.validatePayParams         = validatePayParams;
window.togglePayTaxExemptionRow  = togglePayTaxExemptionRow;
window.toggleThrivecartCheckout  = toggleThrivecartCheckout;
window.addThrivecartQueryParams  = addThrivecartQueryParams;
window.mountThrivecartCheckout   = mountThrivecartCheckout;
window.unmountThrivecartCheckout = unmountThrivecartCheckout;
