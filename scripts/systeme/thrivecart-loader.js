// ---------------------------------------------------------------- //
// Copyright: Innki Tech 2023. All Rights Reserved                  //
// Mantainer: Helder Manuel <helder.manuel@innki.tech>              //
// This file is licensed under the MPL 2.0 license                  //
// License text available at https://www.mozilla.org/en-US/MPL/2.0  //
// ---------------------------------------------------------------- //

// Settings
if (typeof queryParams === "undefined") {
  var queryParams = new URLSearchParams(window.location.search);
}
const checkoutIdValue = queryParams.get(checkoutIdParam);
const couponCodeValue = queryParams.get(couponCodeParam);
const couponCodeCacheValue = queryParams.get(couponCodeCacheParam);
const payFromSpainSelector = document.querySelector(`#${payFromSpainParam}`);
const payTaxExemptionSelector = document.querySelector(`#${payTaxExemptionParam}`);

// Add Thrivecart Params
if (couponCodeValue !== null) thrivecartObj.queryParams["coupon"] = couponCodeValue;
if (couponCodeCacheParam !== null) thrivecartObj.queryParams["coupon_cache"] = couponCodeCacheValue === 'true';
thrivecartObj.queryParams["passthrough[utm_source]"] = queryParams.get("utm_source");
thrivecartObj.queryParams["passthrough[utm_campaign]"] = queryParams.get("utm_campaign");
thrivecartObj.queryParams["passthrough[utm_content]"] = queryParams.get("utm_content");
thrivecartObj.queryParams["passthrough[utm_medium]"] = queryParams.get("utm_medium");
thrivecartObj.queryParams["passthrough[utm_term]"] = queryParams.get("utm_term");
thrivecartObj.queryParams["passthrough[utm_uid]"] = queryParams.get("utm_uid");
thrivecartObj.queryParams["passthrough[utm_lp]"] = queryParams.get("utm_lp");

// Store Params
storeParam(payProcessorParam, "mx");

// Store Query Params
storeQueryParam(queryParams, payFromSpainParam);
storeQueryParam(queryParams, payTaxExemptionParam);

// Load Params
loadParam(payFromSpainParam, payFromSpainSelector, "select");
loadParam(payTaxExemptionParam, payTaxExemptionSelector, "select");

// Mutate Thrivecart Checkout Object if Param is Present
if (checkoutIdValue !== null) {
  for (const [thKey, thValue] of Object.entries(thrivecartObj.checkouts)) {
    for (const [thProcessorKey, thProcessorValue] of Object.entries(thValue)) {
      thrivecartObj.checkouts[thKey][thProcessorKey]["id"] = parseInt(checkoutIdValue);
    }
  }
}

// Remove Query Params
window.removeQueryParams();

// Add Event Listeners
payFromSpainSelector.addEventListener("change", evt => window.storeParam(evt.target.id, evt.target.value));
payFromSpainSelector.addEventListener("change", evt => window.loadParam(payTaxExemptionParam, payTaxExemptionSelector, "select"));
payTaxExemptionSelector.addEventListener("change", evt => window.storeParam(evt.target.id, evt.target.value));
payFromSpainSelector.addEventListener("change", () => window.toggleThrivecartCheckout(thrivecartObj, payProcessorParam, payFromSpainParam, payTaxExemptionParam));
payTaxExemptionSelector.addEventListener("change", () => window.toggleThrivecartCheckout(thrivecartObj, payProcessorParam, payFromSpainParam, payTaxExemptionParam));
window.addEventListener("load", () => window.toggleThrivecartCheckout(thrivecartObj, payProcessorParam, payFromSpainParam, payTaxExemptionParam));