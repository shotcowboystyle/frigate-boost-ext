import select from 'select-dom';
// import { sendMessage } from 'webext-bridge';

const settings = {
  firstClick: 'focus',
  dblFullScreen: true,
  clickDelay: 0.3,
  skipNormal: 5,
  skipShift: 10,
  skipCtrl: 1,
  allowWOControls: false,
};

let pageVideo: HTMLVideoElement | undefined = select('video');
let observer: MutationObserver | undefined = undefined;

const shortcutFuncs = {
  toggleCaptions: function (v: HTMLVideoElement) {
    const validTracks = [];

    for (let i = 0; i < v.textTracks.length; ++i) {
      const tt = v.textTracks[i];

      if (tt.mode === 'showing') {
        tt.mode = 'disabled';

        if (v.textTracks.addEventListener) {
          // If text track event listeners are supported
          // (they are on the most recent Chrome), add
          // a marker to remember the old track. Use a
          // listener to delete it if a different track
          // is selected.
          v.cbhtml5vsLastCaptionTrack = tt.label;

          function cleanup(e) {
            for (let i = 0; i < v.textTracks.length; ++i) {
              const ott = v.textTracks[i];
              if (ott.mode === 'showing') {
                delete v.cbhtml5vsLastCaptionTrack;
                v.textTracks.removeEventListener('change', cleanup);
                return;
              }
            }
          }

          v.textTracks.addEventListener('change', cleanup);
        }

        return;
      } else if (tt.mode !== 'hidden') {
        validTracks.push(tt);
      }
    }

    // If we got here, none of the tracks were selected.
    if (validTracks.length === 0) {
      return true; // Do not prevent default if no UI activated
    }

    // Find the best one and select it.
    validTracks.sort(function (a, b) {
      if (v.cbhtml5vsLastCaptionTrack) {
        const lastLabel = v.cbhtml5vsLastCaptionTrack;

        if (a.label === lastLabel && b.label !== lastLabel) {
          return -1;
        } else if (b.label === lastLabel && a.label !== lastLabel) {
          return 1;
        }
      }

      const aLang = a.language.toLowerCase(),
        bLang = b.language.toLowerCase(),
        navLang = navigator.language.toLowerCase();

      if (aLang === navLang && bLang !== navLang) {
        return -1;
      } else if (bLang === navLang && aLang !== navLang) {
        return 1;
      }

      const aPre = aLang.split('-')[0],
        bPre = bLang.split('-')[0],
        navPre = navLang.split('-')[0];

      if (aPre === navPre && bPre !== navPre) {
        return -1;
      } else if (bPre === navPre && aPre !== navPre) {
        return 1;
      }

      return 0;
    })[0].mode = 'showing';
  },

  togglePlay: function (v: HTMLVideoElement) {
    if (v.paused) {
      v.play();
    } else {
      v.pause();
    }
  },

  toStart: function (v: HTMLVideoElement) {
    v.currentTime = 0;
  },

  toEnd: function (v: HTMLVideoElement) {
    v.currentTime = v.duration;
  },

  skipLeft: function (v: HTMLVideoElement, key, shift, ctrl) {
    if (shift) {
      v.currentTime -= settings.skipShift;
    } else if (ctrl) {
      v.currentTime -= settings.skipCtrl;
    } else {
      v.currentTime -= settings.skipNormal;
    }
  },

  skipRight: function (v: HTMLVideoElement, key, shift, ctrl) {
    if (shift) {
      v.currentTime += settings.skipShift;
    } else if (ctrl) {
      v.currentTime += settings.skipCtrl;
    } else {
      v.currentTime += settings.skipNormal;
    }
  },

  increaseVol: function (v: HTMLVideoElement) {
    if (v.volume <= 0.9) {
      v.volume += 0.1;
    } else {
      v.volume = 1;
    }
  },

  decreaseVol: function (v: HTMLVideoElement) {
    if (v.volume >= 0.1) {
      v.volume -= 0.1;
    } else {
      v.volume = 0;
    }
  },

  toggleMute: function (v: HTMLVideoElement) {
    v.muted = !v.muted;
  },

  toggleFS: function (v: HTMLVideoElement) {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      v.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  },

  reloadVideo: function (v: HTMLVideoElement) {
    const currTime = v.currentTime;
    v.load();
    v.currentTime = currTime;
  },

  slowOrPrevFrame: function (v: HTMLVideoElement, key, shift) {
    if (shift) {
      // Less-Than
      v.playbackRate -= 0.25;
    } else {
      // Comma
      v.currentTime -= 1 / 60;
    }
  },

  fastOrNextFrame: function (v: HTMLVideoElement, key, shift) {
    if (shift) {
      // Greater-Than
      v.playbackRate += 0.25;
    } else {
      // Period
      v.currentTime += 1 / 60;
    }
  },

  normalSpeed: function (v: HTMLVideoElement, key, shift) {
    if (shift) {
      // ?
      v.playbackRate = v.defaultPlaybackRate;
    }
  },

  toPercentage: function (v: HTMLVideoElement, key) {
    v.currentTime = (v.duration * (key - 48)) / 10.0;
  },
};

const keyFuncs = {
  32: shortcutFuncs.togglePlay, // Space
  75: shortcutFuncs.togglePlay, // K
  35: shortcutFuncs.toEnd, // End
  48: shortcutFuncs.toStart, // 0
  36: shortcutFuncs.toStart, // Home
  37: shortcutFuncs.skipLeft, // Left arrow
  74: shortcutFuncs.skipLeft, // J
  39: shortcutFuncs.skipRight, // Right arrow
  76: shortcutFuncs.skipRight, // L
  38: shortcutFuncs.increaseVol, // Up arrow
  40: shortcutFuncs.decreaseVol, // Down arrow
  77: shortcutFuncs.toggleMute, // M
  70: shortcutFuncs.toggleFS, // F
  67: shortcutFuncs.toggleCaptions, // C
  82: shortcutFuncs.reloadVideo, // R
  188: shortcutFuncs.slowOrPrevFrame, // Comma or Less-Than
  190: shortcutFuncs.fastOrNextFrame, // Period or Greater-Than
  191: shortcutFuncs.normalSpeed, // Forward slash or ?
  49: shortcutFuncs.toPercentage, // 1
  50: shortcutFuncs.toPercentage, // 2
  51: shortcutFuncs.toPercentage, // 3
  52: shortcutFuncs.toPercentage, // 4
  53: shortcutFuncs.toPercentage, // 5
  54: shortcutFuncs.toPercentage, // 6
  55: shortcutFuncs.toPercentage, // 7
  56: shortcutFuncs.toPercentage, // 8
  57: shortcutFuncs.toPercentage, // 9
};

function isValidVideoTarget(el) {
  return (
    pageVideo &&
    (el === pageVideo ||
      el === document.body ||
      el === document.documentElement)
    //     ||
    // (el.dataset && el.dataset[videoAttribute])
  );
}

function handleKeyDown(event: KeyboardEvent) {
  if (!isValidVideoTarget(event.target) || event.altKey || event.metaKey) {
    return true; // Do not activate
  }

  const func = keyFuncs[event.keyCode];

  if (func) {
    if (
      (func.length < 3 && event.shiftKey) ||
      (func.length < 4 && event.ctrlKey)
    ) {
      return true; // Do not activate
    }

    func(
      pageVideo || event.target,
      event.keyCode,
      event.shiftKey,
      event.ctrlKey,
    );

    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  return true; // Do not prevent default if no UI activated
}

function handleKeyOther(event: KeyboardEvent) {
  if (!isValidVideoTarget(event.target) || event.altKey || event.metaKey) {
    return true; // Do not prevent default
  }

  const func = keyFuncs[event.keyCode];

  if (func) {
    if (
      (func.length < 3 && event.shiftKey) ||
      (func.length < 4 && event.ctrlKey)
    ) {
      return true; // Do not prevent default
    }

    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  return true; // Do not prevent default if no UI activated
}

function handleMutationRecords(mrs) {
  for (let i = mrs.length - 1; i >= 0; --i) {
    if (mrs[i].attributeName === 'controls') {
      console.log('MUTATION OBSERVER ATTRIBUTES', mrs);
      // const t = mrs[i].target;
      // if (!t.hasAttribute('controls')) {
      //   switch (t.dataset[videoAttribute]) {
      //     case 'direct':
      //       ignoreDirectVideo(false);
      //       break;
      //     case 'normal':
      //       ignoreVideo(t);
      //       break;
      //   }
      // } else if (t.tagName.toLowerCase() === 'video') {
      //   if (
      //     document.body.children.length === 1 &&
      //     document.body.firstElementChild === t
      //   ) {
      //     registerDirectVideo(t);
      //   } else {
      //     registerVideo(t);
      //     t.focus();
      //   }
      // }
    } else if (mrs[i].type === 'childList') {
      console.log('MUTATION OBSERVER CHILDLIST', mrs);

      // if (
      //   dirVideo &&
      //   (document.body.children.length !== 1 ||
      //     document.body.firstElementChild !== dirVideo)
      // ) {
      //   ignoreDirectVideo(true);
      // }
      // if (mrs[i].removedNodes) {
      //   for (let j = mrs[i].removedNodes.length - 1; j >= 0; --j) {
      //     if (mrs[i].removedNodes[j] === dirVideo) {
      //       ignoreDirectVideo();
      //     }
      //     // No need to ignore other videos currently,
      //     // as it's just setting an attribute.
      //   }
      // }
      // if (
      //   document.body.children.length === 1 &&
      //   document.body.firstElementChild !== dirVideo &&
      //   document.body.firstElementChild.tagName.toLowerCase() === 'video' &&
      //   document.body.firstElementChild.dataset[videoAttribute] !== ''
      // ) {
      //   registerDirectVideo(document.body.firstElementChild);
      // } else if (mrs[i].addedNodes) {
      //   for (let j = mrs[i].addedNodes.length - 1; j >= 0; --j) {
      //     const an = mrs[i].addedNodes[j];
      //     if (an.tagName && an.tagName.toLowerCase() === 'video') {
      //       if (an.dataset[videoAttribute] === undefined) {
      //         registerVideo(an);
      //       }
      //     } else if (an.getElementsByTagName) {
      //       registerAllNewVideos(an.getElementsByTagName('video'));
      //     }
      //   }
      // }
    }
  }
}

const init = () => {
  console.log('PAGE VIDEO', pageVideo);
  if (!pageVideo) {
    observer = observer || new MutationObserver(handleMutationRecords);
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      attributeFilter: ['controls'],
      subtree: true,
    });
  }

  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('keypress', handleKeyOther, true);
  document.addEventListener('keyup', handleKeyOther, true);
};

init();
