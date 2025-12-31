var contactName = document.getElementById("name");
var phoneNumber = document.getElementById("phoneNumber");
var emailAddress = document.getElementById("emailAddress");
var address = document.getElementById("address");
var group = document.getElementById("group");
var notes = document.getElementById("notes");
var emerg = document.getElementById("checkEmerg");
var fav = document.getElementById("checkFav");
var img = document.getElementById("profileInput");

var contactList = [];
console.log(JSON.parse(localStorage.getItem("contactList")));

if(localStorage.getItem("contactList")){
  contactList = JSON.parse(localStorage.getItem("contactList"));
}
var counts = {
  total: contactList.length,
  emergency: 0,
  favorites: 0,
};
var regex = {
  name: {
    value: /^[a-zA-Z ]{2,50}$/,
    isValid: false,
    isEmpty: true,
  },
  phoneNumber: {
    value: /^(\+201|01)(0|1|2|5)[0-9]{8}$/,
    isValid: false,
    isEmpty: true,
    isDuplicate: false,
    existedContact: "",
  },
  emailAddress: {
    value: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
    isValid: true,
    isEmpty: true,
  },
};
function emergencyCount() {
  var count = 0;
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].emerg == true) {
      count++;
    }
  }
  counts.emergency = count;
  return count;
}
function favouriteCount() {
  var count = 0;
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].fav == true) {
      count++;
    }
  }
  counts.favorites = count;
  return count;
}

function displayCounts(list) {
  document.getElementById("total").innerText = list.length;
  document.getElementById("favs").innerText = favouriteCount();
  document.getElementById("emergs").innerText = emergencyCount();
  document.getElementById(
    "totalContacts"
  ).innerText = `Manage and organize your ${contactList.length} contacts`;
}
function duplicatePhone(element) {
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].phoneNumber == element.value) {
      regex.phoneNumber.isDuplicate = true;
      regex.phoneNumber.existedContact = contactList[i].name;
      return;
    }
  }
  regex.phoneNumber.isDuplicate = false;
}
function duplicateUpdatedPhone(id, element) {
  for (var i = 0; i < contactList.length; i++) {
    if (id != i && contactList[i].phoneNumber == element.value) {
      regex.phoneNumber.isDuplicate = true;
      regex.phoneNumber.existedContact = contactList[i].name;
      return;
    }
  }
  regex.phoneNumber.isDuplicate = false;
}
function validateInputs(element) {
  //   console.log(element.value);

  if (
    regex[element.id].value.test(element.value) ||
    element.value.length == 0 ||
    element.value.trim().length == 0
  ) {
    regex[element.id].isValid = true;
    element.nextElementSibling.classList.add("d-none");
  } else {
    regex[element.id].isValid = false;
    element.nextElementSibling.classList.remove("d-none");
  }
  if (element.value.length == 0 || element.value.trim().length == 0) {
    regex[element.id].isEmpty = true;
  } else {
    regex[element.id].isEmpty = false;
  }
}
function checkValidations() {
  //   console.log(regex);

  if (regex.name.isEmpty == true) {
    document.getElementById("msg").innerText = "Missing Name";
    document.getElementById("desc").innerText =
      "Please enter a name for the contact!";
    document.getElementById("errorPage").classList.remove("d-none");
    document.getElementById("errorPage").classList.add("d-block");
    return false;
  } else if (regex.name.isValid == false) {
    document.getElementById("msg").innerText = "Invalid Name";
    document.getElementById("desc").innerText =
      "Name should contain only letters and spaces (2-50 characters)";
    document.getElementById("errorPage").classList.remove("d-none");
    document.getElementById("errorPage").classList.add("d-block");
    return false;
  } else if (regex.phoneNumber.isEmpty == true) {
    document.getElementById("msg").innerText = "Missing Phone";
    document.getElementById("desc").innerText = "Please enter a phone number!";
    document.getElementById("errorPage").classList.remove("d-none");
    document.getElementById("errorPage").classList.add("d-block");
    return false;
  } else if (regex.phoneNumber.isValid == false) {
    document.getElementById("msg").innerText = "Invalid Phone";
    document.getElementById("desc").innerText =
      "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)";
    document.getElementById("errorPage").classList.remove("d-none");
    document.getElementById("errorPage").classList.add("d-block");
    return false;
  } else if (regex.phoneNumber.isDuplicate == true) {
    document.getElementById("msg").innerText = "Duplicate Phone Number";
    document.getElementById(
      "desc"
    ).innerText = `A contact with this phone number already exists: ${regex.phoneNumber.existedContact}`;
    document.getElementById("errorPage").classList.remove("d-none");
    document.getElementById("errorPage").classList.add("d-block");
    return false;
  } else if (regex.emailAddress.isValid == false) {
    document.getElementById("msg").innerText = "Invalid Email";
    document.getElementById("desc").innerText =
      "Please enter a valid email address";
    document.getElementById("errorPage").classList.remove("d-none");
    document.getElementById("errorPage").classList.add("d-block");
    return false;
  }
  return true;
}

function addContact() {
  
  var update = document.getElementById("staticBackdrop").hasAttribute("update");
  console.log("field", update);

  if (update == true) {
    var updateField = document
      .getElementById("staticBackdrop")
      .getAttribute("update");
    console.log("field", updateField);

    if (updateField == "true") {
      var index = document
        .getElementById("staticBackdrop")
        .getAttribute("data-id");
      updateContact(index);
      return;
    }
  }

  duplicatePhone(phoneNumber);
  if (!checkValidations()) {
    return;
  }
  console.log(img.files.length == 0 ? '' : `images/${img.files[0].name}`);
  
  var contact = {
    name: contactName.value,
    phoneNumber: phoneNumber.value,
    emailAddress: emailAddress.value,
    address: address.value,
    group: group.value,
    notes: notes.value,
    emerg: emerg.checked,
    fav: fav.checked,
    img: img.files.length == 0 ? '' : `images/${img.files[0].name}`
  };
  if (contact.emerg == true) {
    counts.emergency++;
  }
  if (contact.fav == true) {
    counts.favorites++;
  }
  contactList.push(contact);
  localStorage.setItem("contactList",JSON.stringify(contactList));
  console.log(contactList);
  displayCounts(contactList);
  displayContacts(contactList);
  displayFavourites(contactList);
  displayEmergencies(contactList);
  afterAdding();
  clearForm();
}
function updateContact(i) {
  console.log("updated");

  var contact = contactList[i];
  var updatedContact = {
    name: contactName.value,
    phoneNumber: phoneNumber.value,
    emailAddress: emailAddress.value,
    address: address.value,
    group: group.value,
    notes: notes.value,
    emerg: emerg.checked,
    fav: fav.checked,
    img:`images/${img.files[0]?.name}`
  };
  duplicateUpdatedPhone(i, phoneNumber);
  console.log("regex", regex);

  if (!checkValidations()) {
    return;
  }
  if (contact.emerg == true && updatedContact.emerg == false) {
    counts.emergency--;
  } else if (contact.emerg == false && updatedContact.emerg == true) {
    counts.emergency++;
  }
  if (contact.fav == true && updatedContact.fav == false) {
    counts.favorites--;
  } else if (contact.fav == false && updatedContact.fav == true) {
    counts.favorites++;
  }
  contactList[i].name = contactName.value;
  contactList[i].phoneNumber = phoneNumber.value;
  contactList[i].emailAddress = emailAddress.value;
  contactList[i].address = address.value;
  contactList[i].group = group.value;
  contactList[i].notes = notes.value;
  contactList[i].fav = fav.checked;
  contactList[i].emerg = emerg.checked;
  contactList[i].img = img.files.length == 0 ? '' : `images/${img.files[0].name}`
  localStorage.setItem("contactList",JSON.stringify(contactList));
  displayCounts(contactList);
  displayContacts(contactList);
  displayFavourites(contactList);
  displayEmergencies(contactList);
  afterAdding();
  clearForm();
}
function getContact(i) {
  var contact = contactList[i];
  contactName.value = contact.name;
  phoneNumber.value = contact.phoneNumber;
  address.value = contact.address;
  emailAddress.value = contact.emailAddress;
  notes.value = contact.notes;
  group.value = contact.group;
  fav.checked = contact.fav;
  emerg.checked = contact.emerg;
  const modalEl = document.getElementById("staticBackdrop");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.show();
  document.getElementById("staticBackdrop").setAttribute("update", "true");
  document.getElementById("staticBackdrop").setAttribute("data-id", i);
}
function removeErrorPage() {
  document.getElementById("errorPage").classList.add("d-none");
}
function afterAdding() {
  const modalEl = document.getElementById("staticBackdrop");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
  var update = document.getElementById("staticBackdrop").hasAttribute("update");
  if (update == true) {
    var upfateField = document
      .getElementById("staticBackdrop")
      .getAttribute("update");
    if (upfateField == "true") {
      document.getElementById("updatedPage").classList.remove("d-none");
      document.getElementById("updatedPage").classList.add("d-block");
      setTimeout(function () {
        document.getElementById("updatedPage").classList.remove("d-block");
        document.getElementById("updatedPage").classList.add("d-none");
      }, 1000);
    }
    document.getElementById("staticBackdrop").removeAttribute("update");
  } else {
    document.getElementById("addedPage").classList.remove("d-none");
    document.getElementById("addedPage").classList.add("d-block");
    setTimeout(function () {
      document.getElementById("addedPage").classList.remove("d-block");
      document.getElementById("addedPage").classList.add("d-none");
    }, 1000);
  }
}
function displayContacts(list) {  
  var data = "";
  if (list.length == 0) {    
    document.getElementById("noContacts").classList.remove("d-none");
    document.getElementById("noContacts").classList.add("d-block");
  } else {
    document.getElementById("noContacts").classList.remove("d-block");
    document.getElementById("noContacts").classList.add("d-none");
    for (var i = 0; i < list.length; i++) {
      data += `
                                        <div class="col-12 col-sm-6 align-self-stretch">
                            <div class="contact-card bg-white rounded-3 overflow-hidden  d-flex flex-column justify-content-between">
                                <div class="p-3">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="position-relative">
                                            <div
                                                class="contact-icon-name text-capitalize font-xs-md font-sm-md rounded-3 d-flex align-items-center justify-content-center">
                                                ${contactList[i].img.length == 0 ? contactList[i].name.charAt(0): ""}
                                                <img src="${contactList[i].img}" class="w-100 rounded-3 ${contactList[i].img ? 'd-block': 'd-none'}" alt="${contactList[i].name}">

                                            </div>
                                            <div id="contactFav"
                                                class="contact-fav rounded-circle d-flex align-items-center justify-content-center position-absolute ${
                                                  list[i].fav
                                                    ? "d-block"
                                                    : "d-none"
                                                } ">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12"
                                                    viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                    <path fill="currentColor"
                                                        d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
                                                </svg>
                                            </div>
                                            <div id="contactEmerg"
                                                class="contact-emerg rounded-circle d-flex align-items-center justify-content-center position-absolute ${
                                                  list[i].emerg
                                                    ? "d-block"
                                                    : "d-none"
                                                }">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12"
                                                    viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                    <path fill="currentColor"
                                                        d="M320 171.9L305 151.1C280 116.5 239.9 96 197.1 96C123.6 96 64 155.6 64 229.1L64 231.7C64 255.3 70.2 279.7 80.6 304L186.6 304C189.8 304 192.7 302.1 194 299.1L225.8 222.8C229.5 214 238.1 208.2 247.6 208C257.1 207.8 265.9 213.4 269.8 222.1L321.1 336L362.5 253.2C366.6 245.1 374.9 239.9 384 239.9C393.1 239.9 401.4 245 405.5 253.2L428.7 299.5C430.1 302.2 432.8 303.9 435.9 303.9L559.5 303.9C570 279.6 576.1 255.2 576.1 231.6L576.1 229C576 155.6 516.4 96 442.9 96C400.2 96 360 116.5 335 151.1L320 171.8zM533.6 352L435.8 352C414.6 352 395.2 340 385.7 321L384 317.6L341.5 402.7C337.4 411 328.8 416.2 319.5 416C310.2 415.8 301.9 410.3 298.1 401.9L248.8 292.4L238.3 317.6C229.6 338.5 209.2 352.1 186.6 352.1L106.4 352.1C153.6 425.9 229.4 493.8 276.8 530C289.2 539.4 304.4 544.1 319.9 544.1C335.4 544.1 350.7 539.5 363 530C410.6 493.7 486.4 425.8 533.6 352z" />
                                                </svg>
                                            </div>

                                        </div>
                                        <div class="name-phone">
                                            <p class="name font-xs-base font-md-base">${
                                              list[i].name
                                            }</p>
                                            <div class="d-flex align-items-center gap-2">
                                                <div
                                                    class="phone-icon d-flex align-items-center justify-content-center flex-shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12"
                                                        viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                        <path fill="currentColor"
                                                            d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z" />
                                                    </svg>
                                                </div>
                                                <p class="phone-number font-xs-xs font-sm-xs">${
                                                  list[i].phoneNumber
                                                }</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mail-location d-flex flex-column gap-2 ">
                                        <div class="d-flex align-items-center gap-2 ${
                                          list[i].emailAddress.length > 0
                                            ? "d-block"
                                            : "d-none"
                                        }">
                                            <div
                                                class="mail-icon rounded-2 d-flex align-items-center justify-content-center flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12"
                                                    viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                    <path fill="currentColor"
                                                        d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z" />
                                                </svg>
                                            </div>
                                            <p class="mail-name font-xs-xs font-sm-xs">${
                                              list[i].emailAddress
                                            }</p>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 ${
                                          list[i].address.length > 0
                                            ? "d-block"
                                            : "d-none"
                                        }"">
                                            <div
                                                class="location-icon rounded-2 d-flex align-items-center justify-content-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12"
                                                    viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                    <path fill="currentColor"
                                                        d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" />
                                                </svg>
                                            </div>
                                            <p class="location-name font-xs-xs font-sm-xs">${
                                              list[i].address
                                            }</p>
                                        </div>
                                    </div>
                                    <div class="groups-data d-flex align-items-center gap-2">
                                        <span class="group d-inline-flex align-items-center ${
                                          list[i].group.length > 0
                                            ? "d-block"
                                            : "d-none"
                                        }"">${list[i].group}</span>
                                        <span id="emergIc" class="emerg-ic d-inline-flex align-items-center ${
                                          list[i].emerg ? "d-block" : "d-none"
                                        }"">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12"
                                                viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                <path fill="currentColor"
                                                    d="M320 171.9L305 151.1C280 116.5 239.9 96 197.1 96C123.6 96 64 155.6 64 229.1L64 231.7C64 255.3 70.2 279.7 80.6 304L186.6 304C189.8 304 192.7 302.1 194 299.1L225.8 222.8C229.5 214 238.1 208.2 247.6 208C257.1 207.8 265.9 213.4 269.8 222.1L321.1 336L362.5 253.2C366.6 245.1 374.9 239.9 384 239.9C393.1 239.9 401.4 245 405.5 253.2L428.7 299.5C430.1 302.2 432.8 303.9 435.9 303.9L559.5 303.9C570 279.6 576.1 255.2 576.1 231.6L576.1 229C576 155.6 516.4 96 442.9 96C400.2 96 360 116.5 335 151.1L320 171.8zM533.6 352L435.8 352C414.6 352 395.2 340 385.7 321L384 317.6L341.5 402.7C337.4 411 328.8 416.2 319.5 416C310.2 415.8 301.9 410.3 298.1 401.9L248.8 292.4L238.3 317.6C229.6 338.5 209.2 352.1 186.6 352.1L106.4 352.1C153.6 425.9 229.4 493.8 276.8 530C289.2 539.4 304.4 544.1 319.9 544.1C335.4 544.1 350.7 539.5 363 530C410.6 493.7 486.4 425.8 533.6 352z" />
                                            </svg>
                                            Emergency </span>
                                    </div>
                                </div>
                                <div class="icons d-flex align-items-center justify-content-between px-3">
                                    <div class="d-flex align-items-center gap-2">
                                        <a href="tel:${
                                          list[i].phoneNumber
                                        }" class="call-icon btn d-flex align-items-center justify-content-center p-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"
                                                viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                <path fill="currentColor"
                                                    d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z" />
                                            </svg>
                                        </a>
                                        <button
                                            class="mail-lg-icon btn d-flex align-items-center justify-content-center p-0 ${
                                              list[i].emailAddress.length > 0
                                                ? "d-block"
                                                : "d-none"
                                            }">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"
                                                viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                <path fill="currentColor"
                                                    d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <button id="favIcon" onclick="addFavourite(${i})"
                                            class="${
                                              list[i].fav
                                                ? "star-icon"
                                                : "star-icon-unclicked"
                                            } btn d-flex align-items-center justify-content-center p-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"
                                                viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                <path fill="currentColor"
                                                    d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z" />
                                            </svg>
                                        </button>
                                        <button id="emergIcon" onclick= "addEmergency(${i})"
                                            class="${
                                              list[i].emerg
                                                ? "fa-icon"
                                                : "fa-icon-unclicked"
                                            } btn d-flex align-items-center justify-content-center p-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"
                                                viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                <path fill="currentColor"
                                                    d="M320 171.9L305 151.1C280 116.5 239.9 96 197.1 96C123.6 96 64 155.6 64 229.1L64 231.7C64 255.3 70.2 279.7 80.6 304L186.6 304C189.8 304 192.7 302.1 194 299.1L225.8 222.8C229.5 214 238.1 208.2 247.6 208C257.1 207.8 265.9 213.4 269.8 222.1L321.1 336L362.5 253.2C366.6 245.1 374.9 239.9 384 239.9C393.1 239.9 401.4 245 405.5 253.2L428.7 299.5C430.1 302.2 432.8 303.9 435.9 303.9L559.5 303.9C570 279.6 576.1 255.2 576.1 231.6L576.1 229C576 155.6 516.4 96 442.9 96C400.2 96 360 116.5 335 151.1L320 171.8zM533.6 352L435.8 352C414.6 352 395.2 340 385.7 321L384 317.6L341.5 402.7C337.4 411 328.8 416.2 319.5 416C310.2 415.8 301.9 410.3 298.1 401.9L248.8 292.4L238.3 317.6C229.6 338.5 209.2 352.1 186.6 352.1L106.4 352.1C153.6 425.9 229.4 493.8 276.8 530C289.2 539.4 304.4 544.1 319.9 544.1C335.4 544.1 350.7 539.5 363 530C410.6 493.7 486.4 425.8 533.6 352z" />
                                            </svg>
                                        </button>
                                        <button onclick=getContact(${i})
                                            class="edit-icon btn d-flex align-items-center justify-content-center p-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"
                                                viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                <path fill="currentColor"
                                                    d="M416.9 85.2L372 130.1L509.9 268L554.8 223.1C568.4 209.6 576 191.2 576 172C576 152.8 568.4 134.4 554.8 120.9L519.1 85.2C505.6 71.6 487.2 64 468 64C448.8 64 430.4 71.6 416.9 85.2zM338.1 164L122.9 379.1C112.2 389.8 104.4 403.2 100.3 417.8L64.9 545.6C62.6 553.9 64.9 562.9 71.1 569C77.3 575.1 86.2 577.5 94.5 575.2L222.3 539.7C236.9 535.6 250.2 527.9 261 517.1L476 301.9L338.1 164z" />
                                            </svg>
                                        </button>
                                        <button onclick=warningDelete(${i})
                                            class="bin-icon btn d-flex align-items-center justify-content-center p-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"
                                                viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                                <path fill="currentColor"
                                                    d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
                                            </svg>
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
            `;
    }
  }
  document.getElementById("contactsData").innerHTML = data;
}
function displayFavourites(list) {
  console.log("liist--",list);
  console.log("counts.favorites--",counts.favorites);

  var data = "";
  if (list.length == 0 || counts.favorites == 0) {
    document.getElementById("noFavs").classList.remove("d-none");
    document.getElementById("noFavs").classList.add("d-block");
  } else {
    document.getElementById("noFavs").classList.remove("d-block");
    document.getElementById("noFavs").classList.add("d-none");
    for (var i = 0; i < list.length; i++) {
      if (list[i].fav == true) {
        data += `  <a href="tel:${
          list[i].phoneNumber
        }" class="btn col-12 col-sm-6 col-xl-12">
                                <div class="fav-data d-flex align-items-center justify-content-between p-2">
                                    <div class="fav-data-icon d-flex align-items-center gap-2 ">
                                        <div
                                            class="data-icon text-capitalize d-flex align-items-center justify-content-center flex-shrink-0 rounded-2 font-xs-xs font-sm-xs">
                                            ${list[i].name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 class="data-name m-0">${
                                              list[i].name
                                            }</h4>
                                            <p class="data-number">${
                                              list[i].phoneNumber
                                            }</p>
                                        </div>
                                    </div>
                                    <div class="fav-call d-flex align-items-center justify-content-center ">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"
                                            viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                            <path fill="currentColor"
                                                d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z" />
                                        </svg>
                                    </div>
                                </div>

                            </a>`;
      }
    }
  }
  if (data.length == 0) {
    document.getElementById("noFavs").classList.remove("d-none");
    document.getElementById("noFavs").classList.add("d-block");
  }
  document.getElementById("favsData").innerHTML = data;
}
function displayEmergencies(list) {
  var data = "";
  if (list.length == 0 || counts.emergency == 0) {
    document.getElementById("noEmergs").classList.remove("d-none");
    document.getElementById("noEmergs").classList.add("d-block");
  } else {
    document.getElementById("noEmergs").classList.remove("d-block");
    document.getElementById("noEmergs").classList.add("d-none");
    for (var i = 0; i < list.length; i++) {
      if (list[i].emerg == true) {
        data += `  <a href="tel:${
          list[i].phoneNumber
        }" class="btn col-12 col-sm-6 col-xl-12">
                                <div class="emerg-data d-flex align-items-center justify-content-between p-2">
                                    <div class="emerg-data-icon d-flex align-items-center gap-2 ">
                                        <div
                                            class="data-icon text-capitalize d-flex align-items-center justify-content-center flex-shrink-0 rounded-2 font-xs-xs font-sm-xs">
                                            ${list[i].name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 class="data-name m-0">${
                                              list[i].name
                                            }</h4>
                                            <p class="data-number">${
                                              list[i].phoneNumber
                                            }</p>
                                        </div>
                                    </div>
                                    <div class="emerg-call d-flex align-items-center justify-content-center ">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"
                                            viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
                                            <path fill="currentColor"
                                                d="M224.2 89C216.3 70.1 195.7 60.1 176.1 65.4L170.6 66.9C106 84.5 50.8 147.1 66.9 223.3C104 398.3 241.7 536 416.7 573.1C493 589.3 555.5 534 573.1 469.4L574.6 463.9C580 444.2 569.9 423.6 551.1 415.8L453.8 375.3C437.3 368.4 418.2 373.2 406.8 387.1L368.2 434.3C297.9 399.4 241.3 341 208.8 269.3L253 233.3C266.9 222 271.6 202.9 264.8 186.3L224.2 89z" />
                                        </svg>
                                    </div>
                                </div>

                            </a>`;
      }
    }
  }
  if (data.length == 0) {
    document.getElementById("noEmergs").classList.remove("d-none");
    document.getElementById("noEmergs").classList.add("d-block");
  }
  document.getElementById("emergsData").innerHTML = data;
}
function addFavourite(i) {
  var index = i + 1;
  if (contactList[i].fav) {
    contactList[i].fav = false;
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #favIcon`)
      .classList.remove("star-icon");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #favIcon`)
      .classList.add("star-icon-unclicked");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #contactFav`)
      .classList.remove("d-block");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #contactFav`)
      .classList.add("d-none");
  } else {
    contactList[i].fav = true;
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #favIcon`)
      .classList.remove("star-icon-unclicked");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #favIcon`)
      .classList.add("star-icon");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #contactFav`)
      .classList.add("d-block");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #contactFav`)
      .classList.remove("d-none");
  }
  displayCounts(contactList);
  displayFavourites(contactList);
  localStorage.setItem("contactList",JSON.stringify(contactList));

}
function addEmergency(i) {
  var index = i + 1;
  if (contactList[i].emerg) {
    contactList[i].emerg = false;
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #emergIcon`)
      .classList.remove("fa-icon");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #emergIcon`)
      .classList.add("fa-icon-unclicked");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #contactEmerg`)
      .classList.remove("d-block");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #contactEmerg`)
      .classList.add("d-none");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #emergIc`)
      .classList.remove("d-block");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #emergIc`)
      .classList.add("d-none");
  } else {
    contactList[i].emerg = true;
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #emergIcon`)
      .classList.remove("fa-icon-unclicked");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #emergIcon`)
      .classList.add("fa-icon");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #contactEmerg`)
      .classList.add("d-block");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #contactEmerg`)
      .classList.remove("d-none");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #emergIc`)
      .classList.add("d-block");
    document
      .querySelector(`#contactsData > div:nth-child(${index}) #emergIc`)
      .classList.remove("d-none");
  }
  displayCounts(contactList);
  displayEmergencies(contactList);
  localStorage.setItem("contactList",JSON.stringify(contactList));

}
function clearForm() {
  contactName.value = null;
  phoneNumber.value = null;
  address.value = null;
  emailAddress.value = null;
  notes.value = null;
  group.value = "";
  fav.checked = false;
  emerg.checked = false;
  img.value = ""
  document.getElementById("staticBackdrop").removeAttribute("update");

}
function warningDelete(i) {
  document.getElementById("deletePage").classList.remove("d-none");
  document.getElementById("deletePage").classList.add("d-block");
  document.getElementById("deletePage").setAttribute("data-id", i);
}
function deleteContact() {
  var i = document.getElementById("deletePage").getAttribute("data-id");

  contactList.splice(i, 1);
  displayContacts(contactList);
  displayFavourites(contactList);
  displayEmergencies(contactList);
  displayCounts(contactList);
  document.getElementById("deletePage").removeAttribute("data-id");
  document.getElementById("deletePage").classList.add("d-none");
  document.getElementById("deletePage").classList.remove("d-block");
  document.getElementById("deletedPage").classList.remove("d-none");
  document.getElementById("deletedPage").classList.add("d-block");
  setTimeout(function () {
    document.getElementById("deletedPage").classList.add("d-none");
    document.getElementById("deletedPage").classList.remove("d-block");
  }, 1000);
  localStorage.setItem("contactList",JSON.stringify(contactList));

}
function cancel(tagName) {
  document.getElementById(tagName).classList.add("d-none");
  document.getElementById(tagName).classList.remove("d-block");
}
function searchInput(element) {
  searchValue = element.value;
  var searchList = [];
  for (var i = 0; i < contactList.length; i++) {
    if (
      contactList[i].name.toLowerCase().includes(searchValue.toLowerCase()) ||
      contactList[i].phoneNumber.includes(searchValue) ||
      contactList[i].emailAddress
        .toLowerCase()
        .includes(searchValue.toLowerCase())
    ) {
      searchList.push(contactList[i]);
    }
  }
  displayContacts(searchList);
}
displayCounts(contactList);
displayContacts(contactList);
displayFavourites(contactList);
displayEmergencies(contactList);
