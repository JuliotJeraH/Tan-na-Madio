// Minimal geo utilities placeholder
module.exports = {
  distance: (a, b) => {
    // a and b are {lat, lng}
    const toRad = v => (v * Math.PI) / 180;
    const R = 6371e3; // metres
    const phi1 = toRad(a.lat);
    const phi2 = toRad(b.lat);
    const dPhi = toRad(b.lat - a.lat);
    const dLambda = toRad(b.lng - a.lng);
    const hav = Math.sin(dPhi/2)**2 + Math.cos(phi1)*Math.cos(phi2)*Math.sin(dLambda/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(hav), Math.sqrt(1-hav));
    return R * c;
  }
};
