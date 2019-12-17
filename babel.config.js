const presets = [
  [
    "@babel/env",
    {
      targets: {
        ie: "6",
        firefox: "21",
        ios: "10" 
      }
    }
  ],
];

module.exports = { presets };
