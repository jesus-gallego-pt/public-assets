// ---------------------------------------------------------------- //
// Copyright: Innki Tech 2023. All Rights Reserved                  //
// Mantainer: Helder Manuel <helder.manuel@innki.tech>              //
// This file is licensed under the MPL 2.0 license                  //
// License text available at https://www.mozilla.org/en-US/MPL/2.0  //
// ---------------------------------------------------------------- //

const thrivecartQueryParams = new URLSearchParams(window.location.search);
const thrivecartCustomerAddressCountry = thrivecartQueryParams.get("passthrough[customer_address_country]");
const thrivecartCustomerAddressState = thrivecartQueryParams.get("passthrough[customer_address_state]");
setTimeout(() => {
  const thrivecartCustomerAddressCountrySelector = document.querySelector("#field-customer-address-country");
  const thrivecartCustomerAddressStateSelector = document.querySelector("#field-customer-address-state");
  if (thrivecartCustomerAddressCountry != null) {
    thrivecartCustomerAddressCountrySelector.disabled = true;
    //thrivecartCustomerAddressCountrySelector.parentElement.style.display = "none";
  } else {
    thrivecartCustomerAddressCountrySelector.removeChild(document.querySelector("option[value='ES']"));
  }
  if (thrivecartCustomerAddressState != null) {
    thrivecartCustomerAddressStateSelector.value = thrivecartCustomerAddressState;
    thrivecartCustomerAddressStateSelector.disabled = true;
  }
}, 2000);