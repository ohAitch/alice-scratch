__filename = '/Users/home/file/code/scratch/dotfiles/.hammerspoon%2Finit.lua'

------------------------------------ prelude -----------------------------------
-- function read_file(x) local t = io.open(x); local r = t:read('*a'); t:close(); return r; end
function start(x) table.insert(persists,x:start()) end; persists = {}
-- function timer(x) table.insert(timers,x) end; timers = {}
function Z(cb,...) start(hs.task.new('/usr/local/bin/ζλ',cb,{...})) end
function s_start(x,a) return string.sub(x,1,string.len(a)) == a end
function some_flip(f,x) for _,x in pairs(x) do if f(x) then return true end end end
json = hs.json.encode
function simple_send(address,x) local H = hs.socket.new() ;H:connect(table.unpack(address)):write(json(x)..'\n' ,function() H:disconnect() end) end

--------------------------------------------------------------------------------
hs.autoLaunch(true)
hs.automaticallyCheckForUpdates(true)
hs.dockIcon(false)
hs.menuIcon(false)
hs.ipc.cliInstall()

----- reload on config Δ -----
start(hs.pathwatcher.new(__filename, function(files)
	local t = false; for _,file in pairs(files) do if file:sub(-4) == '.lua' then t = true end end; if t then hs.reload() end
	end))

------------ clock -----------
time_bar = hs.menubar.new():priority(hs.menubar.priorities['system']) -- :setClickCallback(function() Z(nil,'shᵥ`open /System/Library/PreferencePanes/DateAndTime.prefPane`') end)
ds = {'𐑕𐑩𐑯','𐑥𐑵𐑯','𐑑𐑧𐑮','𐑢𐑴𐑛𐑧𐑯','𐑔𐑷𐑮','𐑓𐑮𐑦𐑜','𐑕𐑨𐑑'}
function update_time() local now = os.time(); time_bar:setTitle(ds[os.date('%w')+1]..' '..os.date('-%m-%d %H%M',now):lower()..'⁝'..os.date('!%H%M',now)..' Z'..'⁝'..string.gsub((now//60*60)..'','(.*)(...)(...)','%1 %2 %3')) end
tb_timer = nil
loop = function() update_time(); tb_timer = hs.timer.doAfter(60 - os.time()%60,loop) end; loop()
start(hs.caffeinate.watcher.new(function (ev) if ev == hs.caffeinate.watcher.systemDidWake then update_time() end end))

---- watch distributednotifications ----
start(hs.distributednotifications.new(function(name,object,data)
	dn_is = function(x) return name == x or s_start(name,x..'.') end
	if name == 'com.spotify.client.PlaybackStateChanged' then
		Z(nil,'t ← '..hs.json.encode(data)..[[;
			delete Number.prototype.inspect
			out ← ι=> fs.appendFileSync(φ`~/file/.archive/spotify2.txt`+'',util_inspect_autodepth(ι)+'\n')
			out({ ,time:Time().i ,track:{ ,id:t['Track ID'] ,'play‖':t['Play Count'] } ,at:t['Playback Position'] ,action:t['Player State'].toLowerCase()/*∈['stopped','playing','paused']*/ })
			[id,spotify_volume] ← osaᵥ`spotify: { id of current track, sound volume }`; t ← osaᵥ`get volume settings`; out({ ,time:Time().i ,track:{ ,id } ,spotify_volume ,volume:t['output volume'] ,muted:t['output muted'] })
			]]) end
	if not( object == 'ArqAgent-home' or some_flip(function(x) return s_start(name,x) end,{ '𐅪𐅬𐅦𐅯𐅮'
		,'__kIDSRegistrationKeychainChangedNotification'
		,'_NSDoNotDisturb'
		,'ACDAccountStoreDidChangeNotification'
		,'AppleEnabledInputSourcesChangedNotification'
		,'AppleKeyboardMenuPreferencesChangedNotification'
		,'AppleKeyboardPreferencesSelectedItemsChangedNotification'
		,'AppleSelectedInputSourcesChangedNotification'
		,'ATS_DB_Changed'
		,'ATZDaemonDidStopDistribuitedNotification'
		,'ATZDaemonWillStartDistribuitedNotification'
		,'bitu*04280CC0'
		,'brtg*04280CC0'
		,'brtu*04280CC0'
		,'com.apple.AmbientLightSensorHID'
		,'com.apple.AOSAccounts'
		,'com.apple.AOSKit'
		,'com.apple.appstore'
		,'com.apple.backup'
		,'com.apple.bookmarks'
		,'com.apple.Bluetooth'
		,'com.apple.bluetooth.status'
		,'com.apple.calendar'
		,'com.apple.carbon.core.DirectoryNotification'
		,'com.apple.Carbon.TISNotifyEnabledNonKeyboardInputSourcesChanged'
		,'com.apple.CFNetwork'
		,'com.apple.HIToolbox'
		,'com.apple.IOBluetooth'
		,'com.apple.iTunes.libraryChanged'
		,'com.apple.iTunes.prefsChanged'
		,'com.apple.launchpad'
		,'com.apple.LaunchServices'
		,'com.apple.locationmenu.menuchanged'
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
		,'com.apple.suggestions'
		,'com.apple.systemBeep'
		,'com_apple_CoreText_FontManagerScanCompletedWithNoChangesNotification'
		,'HelpBookRegistrationDidChange'
		,'HPDHelpDataIsTerminating'
		,'HPDIndexDidChangeNotification'
		,'ISNotificationAccountAuthenticateFailed'
		,'LocationCacheDidChangeDistribuitedNotification'
		,'NOTIFICATIONTITLE_ADCS'
		,'NSFontCollectionDidChange_private'
		,'NSPersistentUIBitmapEncryptionKeyDidChange'
		,'PDSharedPaymentWebServiceDidChangeNotification'
		,'QLSharedPreviewPanelWillOpenNotification'
		,'SUScanDidFinishDistributedNotification'
		,'UAZoomFocusDidChangeNotification'
		,'UniversalAccessDomainCloseViewSettingsDidChangeNotification'
		,'VSActiveSubscriptionsDidChangeNotification'

		,'BetterTouchToolInstanceStarted'
		,'BTTReadyNotification'
		,'kKBFUSEMount'
		,'SUSoftwareUpdateDaemonStarted'
		,'Loaded Kext Notification'
		,'com.adobe.accc'
		,'com.binaryage.dismissedGrid'
		,'com.hegenberg.BetterTouchTool.isStillAlive'
		,'com.spotify.client.PlaybackStateChanged'
		,'com.sublimetext.CommandLine'
		})) then print('‡ '..hs.inspect({ name, object, data }):gsub('\n *',' ')) end
	end))

------------------------------
-- start(hs.speech.listener.new():commands({'build','start','yes','github'}):setCallback(function(this,x) hs.alert('heard '..x) end))

-- start(hs.wifi.watcher.new(function() ... end))
-- hs.wifi.currentNetwork()
-- hsᵥ`hs.wifi.currentNetwork()`

-- 'sssss' on 1 off 2; 'lip pop' 3
-- start(hs.noises.new(function(x) hs.alert.show('noise'..x) end))

-- hs.uielement.focusedElement():selectedText()

-- http://hammerspoon.org/docs/hs.pasteboard.html
-- http://hammerspoon.org/docs/hs.application.html & http://hammerspoon.org/docs/hs.hints.html & http://hammerspoon.org/docs/hs.grid.html & http://hammerspoon.org/docs/hs.layout.html & http://hammerspoon.org/docs/hs.mjomatic.html & http://hammerspoon.org/docs/hs.window.html & http://hammerspoon.org/docs/hs.window.filter.html & http://hammerspoon.org/docs/hs.window.switcher.html
-- or, http://www.hammerspoon.org/docs/hs.canvas.html

------------------------------
-- spotify launch -> fullscreen
-- this would work except for the thing making it not work
-- start(hs.application.watcher.new(function(_,ev,app)
-- 	if ev == hs.application.watcher.launched and app:bundleID() == 'com.spotify.client' then
-- 		-- hs.timer.doAfter(1,function()
-- 			Z(nil,'terminal_do_script(sh`ζ --fresh ${\'osaᵥ`system events: tell process "Spotify"; set value of attribute "AXFullScreen" of window 1 to true; end tell`\'}; exit`)')
-- 			-- end)
-- 		end end))

------------------------------
-- hs.console.clearConsole()
-- hs.reload()


-- http://www.hammerspoon.org/Spoons/ very neat, look at
