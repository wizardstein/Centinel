(function(){
  let pfSenseloginClass = "loginCont";
  let subdomain = document.location.host.split(".")[0];
  let isPod = subdomain.endsWith("-pod");
  let isPfSense = document.getElementsByTagName("footer")[0].innerText.indexOf("pfSense")!=-1;
  let isLoggedIn = document.getElementsByClassName(pfSenseloginClass).length === 0;
  if (!(isPod && isPfSense && isLoggedIn))
    return
  
  if (!(document.location.pathname === "/firewall_nat.php"))
    return
  
  let rulesTable = document.getElementById("ruletable");
  if (rulesTable === null)
    return
  
  if (!(rulesTable.tHead && rulesTable.tHead.rows.length === 1))
    return

  // look for column indexes for ip and port
  let destPortCellIndex, ipCellIndex, portCellIndex;
  let tColumnsCount = rulesTable.tHead.rows[0].cells.length;
  for (let i = 0; i<tColumnsCount;i++){
    let thisCell = rulesTable.tHead.rows[0].cells[i];
    if (thisCell.textContent === "NAT IP")
      ipCellIndex = i;
    else if (thisCell.textContent === "NAT Ports")
      portCellIndex = i;
    else if (thisCell.textContent === "Dest. Ports")
      destPortCellIndex = i;
  }

  if (rulesTable.tBodies && rulesTable.tBodies.length === 1) {
    // look for port forwarding rules that can redirect to pod https pages
    let tBody = rulesTable.tBodies[0];
    for (let i = 0;i<tBody.rows.length;i++){
      let thisRow = tBody.rows[i];
      let thisRowColsCount = thisRow.cells.length;
      if (thisRowColsCount === tColumnsCount) {
        if (thisRow.cells[portCellIndex].textContent.indexOf("HTTPS") != -1) {
          let httpsUrl = document.location.protocol + "//" + 
                            document.location.hostname + ":" + 
                              thisRow.cells[destPortCellIndex]
                                .textContent.trim();
          thisRow.cells[ipCellIndex].innerHTML = "<a href=\""+ httpsUrl +"\" target=\"_blank\">"+ thisRow.cells[ipCellIndex].textContent.trim() +"</a>"
        }
        else if (thisRow.cells[portCellIndex].textContent.indexOf("SSH") != -1) {
          if (window.navigator.platform.toLowerCase().includes("mac"))
          {
            let ssh = "ssh://admin@" + document.location.hostname + ":" + 
                      thisRow.cells[destPortCellIndex].textContent.trim();

            thisRow.cells[ipCellIndex].innerHTML = "<a href=\""+ ssh + "\" target=\"_blank\">" + thisRow.cells[ipCellIndex].textContent.trim() + "</a>";
          }
          else {
            let ssh = "ssh admin@" + document.location.hostname + " -p " + 
                      thisRow.cells[destPortCellIndex].textContent.trim();

            thisRow.cells[ipCellIndex].innerHTML = "<a class=\"sshlink\" name=\""+ ssh + "\">" + thisRow.cells[ipCellIndex].textContent.trim() + "</a>";
          }
        }
      }
    }
  }
  
})()

$(document).on("click", "a", function(){
  if ($(this).hasClass("sshlink"))
  {
    let message = $(this).attr('name');

    chrome.runtime.sendMessage({
        type: 'native-host-ssh',
        value: message
    })
  }
});