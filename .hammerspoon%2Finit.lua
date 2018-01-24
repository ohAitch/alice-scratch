-- make
-- #watch_distributednotifications
-- a pretty pure js thing
-- then do #clock in pure js
-- then you've eaten almost everything

__filename = '/Users/home/file/code/scratch/dotfiles/.hammerspoon%2Finit.lua'
qwml = nil

------------------------------------ prelude -----------------------------------
function start(x) table.insert(k87f,x:start()) end ;k87f = {}
function Za(...) start(hs.task.new('/usr/local/bin/ζλ',nil,{...})) end
function Zv(x,cb) start(hs.task.new('/usr/local/bin/ζλ',cb,{x})) end
function s_start(x,a) return string.sub(x,1,string.len(a)) == a end
function some_flip(f,x) for _,x in pairs(x) do if f(x) then return true end end end
json = hs.json.encode

--------------------------------------------------------------------------------
hs.autoLaunch(true)
hs.automaticallyCheckForUpdates(true)
hs.dockIcon(false)
hs.menuIcon(false)
hs.ipc.cliInstall()

---------- reload on config Δ ----------
start(hs.pathwatcher.new(__filename ,function(files)
	local t = false ;for _,file in pairs(files) do if file:sub(-4) == '.lua' then t = true end end ;if t then hs.reload() end
	end))

----------------- clock ----------------
nlh7 = hs.menubar.new():priority(hs.menubar.priorities['system'])
	:setClickCallback(function() Za('hand.ι = Time().day_s3 ;') end)
function aj4b() Zv([[
	Time().day_s3
	+'⁝'+ seq_ws`_ 𐑥𐑵𐑯 𐑑𐑧𐑮 𐑢𐑴𐑛𐑧𐑯 𐑔𐑷𐑮 𐑓𐑮𐑦𐑜 𐑕𐑨𐑑 𐑕𐑩𐑯`[npm`moment@2.20.1`().isoWeekday()]
	+' '+ Time().local.mdhm.replace('T',' ').replace(':','') ]],function(c,x) nlh7:setTitle(x) end) end

m7el = function() aj4b() ;qwml = hs.timer.doAfter(60 - os.time()%60,m7el) end ;m7el()
start(hs.caffeinate.watcher.new(function (ev) if ev == hs.caffeinate.watcher.systemDidWake then aj4b() end end))

---- watch distributednotifications ----
start(hs.distributednotifications.new(function(name,object,data)
	dn_is = function(x) return name == x or s_start(name,x..'.') end
	if name == 'com.spotify.client.PlaybackStateChanged' then
		Za('t ← '..hs.json.encode(data)..[[;
			delete Number.prototype.inspect
			out ← ι=> fs.appendFileSync(φ`~/file/.archive/spotify2.txt`+'',util_inspect_autodepth(ι)+'\n')
			out({ ,time:Time().i ,track:{ ,id:t['Track ID'] ,'play‖':t['Play Count'] } ,at:t['Playback Position'] ,action:t['Player State'].toLowerCase()/*∈['stopped','playing','paused']*/ })
			[id,spotify_volume] ← osaᵥ`spotify: { id of current track ,sound volume }` ;t ← osaᵥ`get volume settings` ;out({ ,time:Time().i ,track:{ ,id } ,spotify_volume ,volume:t['output volume'] ,muted:t['output muted'] })
			]]) end
	if not( object == 'ArqAgent-home' or some_flip(function(x) return s_start(name,x) end,{ '𐅪𐅬𐅦𐅯𐅮'
		,'__kIDSRegistrationKeychainChangedNotification'
		,'_NSDoNotDisturb'
		,'ACDAccountStoreDidChangeNotification'
		,'AppleEnabledInputSourcesChangedNotification'
		,'AppleKeyboardMenuPreferencesChangedNotification'
		,'AppleKeyboardPreferencesSelectedItemsChangedNotification'
		,'AppleInterfaceMenuBarHidingChangedNotification'
		,'AppleSelectedInputSourcesChangedNotification'
		,'ATS_DB_Changed'
		,'ATZDaemonDidStopDistribuitedNotification'
		,'ATZDaemonWillStartDistribuitedNotification'
		,'bitu*04280CC0'
		,'brtg*04280CC0'
		,'brtu*04280CC0'
		,'CalAgentAliveNotification'
		,'com.apple.AmbientLightSensorHID'
		,'com.apple.AOSAccounts'
		,'com.apple.AOSKit'
		,'com.apple.appstore'
		,'com.apple.backup'
		,'com.apple.Bluetooth'
		,'com.apple.bluetooth.status'
		,'com.apple.bookmarks'
		,'com.apple.calendar'
		,'com.apple.CalendarPersistence'
		,'com.apple.carbon.core.DirectoryNotification'
		,'com.apple.Carbon.TISNotifyEnabledNonKeyboardInputSourcesChanged'
		,'com.apple.CFNetwork'
		,'com.apple.HIToolbox'
		,'com.apple.IOBluetooth'
		,'com.apple.iTunes.libraryChanged'
		,'com.apple.iTunes.playerInfo'
		,'com.apple.iTunes.prefsChanged'
		,'com.apple.launchpad'
		,'com.apple.LaunchServices'
		,'com.apple.locationmenu.menuchanged'
		,'com.apple.logoutCancelled'
		,'com.apple.logoutInitiated'
		,'com.apple.MCX'
		,'com.apple.mds'
		,'com.apple.MultitouchSupport'
		,'com.apple.packagekit'
		,'com.apple.rcd'
		,'com.apple.SafariBookmarksSync'
		,'com.apple.screenIs'
		,'com.apple.screenLock'
		,'com.apple.SecurityAgent'
		,'com.apple.shieldWindow'
		,'com.apple.softwareupdate.note.RecommendedUpdateCountChanged'
		,'com.apple.sound.settingsChangedNotification'
		,'com.apple.suggestions'
		,'com.apple.systemBeep'
		,'com.apple.unmountassistant'
		,'com_apple_CoreText_FontManagerScanCompletedWithNoChangesNotification'
		,'HelpBookRegistrationDidChange'
		,'HPDHelpDataIsTerminating'
		,'HPDIndexDidChangeNotification'
		,'ISNotificationAccountAuthenticateFailed'
		,'LocationCacheDidChangeDistribuitedNotification'
		,'NOTIFICATIONTITLE_ADCS'
		,'NSFontCollectionDidChange_private'
		,'NSPersistentUIBitmapEncryptionKeyDidChange'
		,'NSServicesChangedNotification'
		,'PDSharedPaymentWebServiceDidChangeNotification'
		,'QLSharedPreviewPanelWillOpenNotification'
		,'QueueStoppedNotification'
		,'SUScanDidFinishDistributedNotification'
		,'UAZoomFocusDidChangeNotification'
		,'UniversalAccessDomainCloseViewSettingsDidChangeNotification'
		,'VSActiveSubscriptionsDidChangeNotification'

		,'BetterTouchToolInstanceStarted'
		,'BRContainerListDidChangeDistributedNotification'
		,'BTTReadyNotification'
		,'com.adobe.accc'
		,'com.binaryage.dismissedGrid'
		,'com.hegenberg.BetterTouchTool.isStillAlive'
		,'com.spotify.client.PlaybackStateChanged'
		,'com.sublimetext.CommandLine'
		,'kKBFUSEMount'
		,'Loaded Kext Notification'
		,'SUSoftwareUpdateDaemonStarted'
		})) then print('‡ '..hs.inspect({ name ,object ,data }):gsub('\n *',' ')) end
	end))

----------------------------------------
-- start(hs.speech.listener.new():commands({'build','start','yes','github'}):setCallback(function(this,x) hs.alert('heard '..x) end))

-- start(hs.wifi.watcher.new(function() ... end))
-- hs.wifi.currentNetwork()
-- hsᵥ`hs.wifi.currentNetwork()`

-- 'sssss' on 1 off 2 ;'lip pop' 3
-- start(hs.noises.new(function(x) hs.alert.show('noise'..x) end))

-- hs.uielement.focusedElement():selectedText()

-- http://hammerspoon.org/docs/hs.pasteboard.html
-- http://hammerspoon.org/docs/hs.application.html & http://hammerspoon.org/docs/hs.hints.html & http://hammerspoon.org/docs/hs.grid.html & http://hammerspoon.org/docs/hs.layout.html & http://hammerspoon.org/docs/hs.mjomatic.html & http://hammerspoon.org/docs/hs.window.html & http://hammerspoon.org/docs/hs.window.filter.html & http://hammerspoon.org/docs/hs.window.switcher.html
-- or ,http://www.hammerspoon.org/docs/hs.canvas.html

----------------------------------------
-- spotify launch -> fullscreen
-- this would work except for the thing making it not work
-- start(hs.application.watcher.new(function(_,ev,app)
-- 	if ev == hs.application.watcher.launched and app:bundleID() == 'com.spotify.client' then
-- 		-- hs.timer.doAfter(1,function()
-- 			Za('terminal_do_script(sh`ζ --fresh ${\'osaᵥ`system events: tell process "Spotify" ;set value of attribute "AXFullScreen" of window 1 to true ;end tell`\'} ;exit`)')
-- 			-- end)
-- 		end end))

----------------------------------------
-- hs.console.clearConsole()

-- http://www.hammerspoon.org/Spoons/ very neat ,look at
