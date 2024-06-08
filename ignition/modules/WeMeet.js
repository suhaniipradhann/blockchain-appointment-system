const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const WeMeetModule = buildModule("WeMeetModule", (m) => {
  const token = m.contract("WeMeet");

  return { token };
});

module.exports = WeMeetModule;
