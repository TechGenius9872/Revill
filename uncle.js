function uncle() {
    console.log("Gary is a uncle");
}

function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Common mobile keywords
  if (/android|ipad|iphone|ipod|blackberry|iemobile|opera mini|webos|fennec|mobile|phone/i.test(userAgent)) {
    return true;
  }
  return false;
}

if (isMobileDevice()) {
  var desktop = false;
  console.log("Mobile device detected");
} else {
  var desktop = true;
  console.log("Desktop device detected");
}

if (!desktop) {
    window.location.href = "unsupported.html";
}