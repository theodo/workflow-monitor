export const sendEvent = (category, action, label, value) => {
  if ('ga' in window) {
    const tracker = window.ga.getAll()[0];
    if (tracker){
      if (value) tracker.send('event', category,action, label, value);
      else tracker.send('event', category,action, label );
    }
  }
};
