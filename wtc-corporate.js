/* WTC Sonic shared sidebar and three-track music control */
(() => {
  const songs = [
    {src:"english.mp3", label:"English Theme"},
    {src:"chinese.mp3", label:"中文主题音乐"},
    {src:"malay.mp3", label:"Lagu Tema Bahasa Melayu"}
  ];
  let nextTrack = 0;
  const audio = document.getElementById("wtcBackgroundMusic");
  const button = document.getElementById("wtcMusicButton");
  const trackLabel = document.getElementById("wtcTrackName");
  const playIcon = document.getElementById("wtcMusicIcon");
  function setSidebar(open){
    document.body.classList.toggle("wtc-sidebar-open",open);
    const trigger=document.querySelector(".wtc-menu-trigger");
    if(trigger) trigger.setAttribute("aria-expanded",String(open));
  }
  document.querySelectorAll(".wtc-menu-trigger").forEach(btn=>{
    btn.addEventListener("click",()=>setSidebar(!document.body.classList.contains("wtc-sidebar-open")));
  });
  document.querySelector(".wtc-sidebar-backdrop")?.addEventListener("click",()=>setSidebar(false));
  document.querySelector(".wtc-sidebar-close")?.addEventListener("click",()=>setSidebar(false));
  document.querySelectorAll(".wtc-sidebar-nav a").forEach(a=>a.addEventListener("click",()=>setSidebar(false)));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")setSidebar(false)});
  if(audio && button){
    button.addEventListener("click",async()=>{
      const track=songs[nextTrack];
      audio.pause(); audio.currentTime=0; audio.src=track.src; audio.load();
      if(trackLabel) trackLabel.textContent=track.label;
      button.disabled=true;
      try{
        await audio.play();
        if(playIcon) playIcon.textContent="Ⅱ";
        button.setAttribute("aria-label","Pause "+track.label);
        nextTrack=(nextTrack+1)%songs.length;
      }catch(error){
        if(trackLabel) trackLabel.textContent=track.label+" — tap again to play";
        console.warn("WTC music playback was blocked by the browser:",error);
      }finally{button.disabled=false}
    });
    audio.addEventListener("ended",()=>{if(playIcon)playIcon.textContent="▶"});
    audio.addEventListener("pause",()=>{if(playIcon)playIcon.textContent="▶"});
    audio.addEventListener("play",()=>{if(playIcon)playIcon.textContent="Ⅱ"});
  }
})();
