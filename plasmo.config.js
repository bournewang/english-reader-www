module.exports = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      })
      return config
    },
    web_accessible_resources: [
      {
        resources: ["styles/overlay.css"],
        matches: ["<all_urls>"]
      }
    ],
    permissions: [
        "storage",
        "activeTab",
        "scripting"
    ]
  }