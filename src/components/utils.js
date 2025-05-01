// Helper function to format views
export const formatViewCount = (views) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M views";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K views";
  } else {
    return views + " views";
  }
};

// Helper function to format time
export const formatTime = (date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return years + " years ago";
  if (months > 0) return months + " months ago";
  if (days > 0) return days + " days ago";
  if (hours > 0) return hours + " hours ago";
  if (minutes > 0) return minutes + " minutes ago";
  return "Just now";
};
