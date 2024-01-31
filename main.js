function init() {
  for(var i in window.SONG_LIST) {
    var entry = window.SONG_LIST[i]
    var parts = entry['path'].split('/')
    parts = parts.map(function(p) { return encodeURIComponent(p) })
    entry['url'] = parts.join('/')
  }
  window.addEventListener('keydown', function(evt) {
    switch(evt.code) {
      case "Space":
        var audio = document.getElementById('audio')
        if(audio.paused) {
          audio.play()
        } else {
          audio.pause()
        }
        break
      case "Enter": // enter
        next_song()
        break
      case "KeyS": // s
        show_answer()
        break
      default:
        console.log(evt)
    }
  })
  document.getElementById('custom-content').innerHTML = window.FOOTER_TEXT
  var audio = document.getElementById('audio')
  audio.addEventListener('ended', function(evt) {
    show_answer()
  })
}

function setSeed(seed) {
  var funcs = (function() {
    var val = seed
    return {
      rand: function() {
        val = (val * 9301 + 49297) % 233280
        return val / 233280
      },
    }
  }())
  window.random = funcs.rand
}
setSeed(Math.ceil(Math.random()*10000))

function shuffle(a) {
  var s = Array.from(a)
  var j, x, i;
  for (i = s.length - 1; i > 0; i--) {
    j = Math.floor(window.random() * (i + 1));
    x = s[i];
    s[i] = s[j];
    s[j] = x;
  }
  return s;
}

function shuffle_songs() {
  window.SONG_QUEUE = shuffle(window.SONG_LIST)
  window.currentIndex = -1
}

function next_song() {
  window.currentIndex++
  if(window.currentIndex >= window.SONG_QUEUE.length) {
    alert('所有歌都猜完啦！')
    window.currentIndex = 0
  }
  var audio = document.getElementById('audio')
  var song = window.SONG_QUEUE[window.currentIndex]
  var song_name_ele = document.getElementById('song-name')
  song_name_ele.className = ""
  song_name_ele.innerHTML = ''
  audio.src = song.url
  audio.load()
  audio.play()
  console.log(song)
  if(window.songTimeout) {
    window.clearTimeout(window.songTimeout)
  }
  if(window.countInterval) {
    window.clearInterval(window.countInterval)
  }
  /*window.countInterval = window.setInterval(function() {
    var cd = Math.round(window.GUESS_TIME - audio.currentTime)
    if(cd < 0) {
      song_name_ele.innerHTML = ""
      return
    } else {
      song_name_ele.innerHTML = "倒计时：<i class=\"count_down\">" + cd + "</i>  秒"
    }
    if(cd <= 5) {
      song_name_ele.className = "near"
    } else {
      song_name_ele.className = ""
    }
  }, 500)*/
  //window.songTimeout = window.setTimeout(show_answer, (window.GUESS_TIME+2)*1000)
}

function show_answer() {
  var song = window.SONG_QUEUE[window.currentIndex]
  var song_name_ele = document.getElementById('song-name')
  if(window.countInterval) {
    window.clearInterval(window.countInterval)
  }
  window.countInterval = null
  song_name_ele.innerHTML = song.name
}

function pause() {
  if(window.songTimeout) {
    window.clearTimeout(window.songTimeout)
    window.songTimeout = null
  }
  if(window.countInterval) {
    window.clearInterval(window.countInterval)
    window.countInterval = null
  }
  var audio = document.getElementById('audio')
  audio.src = null
  audio.load()
  var song_name = document.getElementById('song-name')
  song_name.innerHTML = '已暂停'
}

init()
shuffle_songs()
