const projectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID || process.env.EAS_PROJECT_ID;

module.exports = ({ config }) => {
  const updates = {
    ...config.updates,
  };

  const extra = {
    ...config.extra,
  };

  if (projectId) {
    updates.url = `https://u.expo.dev/${projectId}`;
    extra.eas = {
      ...(extra.eas ?? {}),
      projectId,
    };
  }

  return {
    ...config,
    updates,
    extra,
  };
};
