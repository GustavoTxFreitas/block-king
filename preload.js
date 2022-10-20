// preload.js

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
  })


  /*
  <div class="containerDefaultBlock">
                            <h4 class="preventSelect">Movimento</h4>

                            <!-- - - - - - - - - - - - - - - MOVIMENTO - - - - - - - - - - - - - - -->
                        
                            <div class="containerBlock">
                                <svg class="defaultBlock">
                                    <path class="path" stroke="#3373CC" stroke-width="2" fill="#4C97FF"
                                    d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 157.82021713256836 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-10 z"/>
                                </svg>
                            </div><!--containerBlock-->
                            
                        </div><!--containerDefaultBlock-->
  
  */