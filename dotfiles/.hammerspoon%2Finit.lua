__filename = '/Users/home/file/code/scratch/dotfiles/.hammerspoon%2Finit.lua'

------------------------------------- util -------------------------------------
-- function read_file(x) local t = io.open(x); local r = t:read('*a'); t:close(); return r; end
function start(x) table.insert(persists,x:start()) end; persists = {}
function timer(x) table.insert(timers,x) end; timers = {}
function Z(cb,...) start(hs.task.new('/usr/local/bin/ζλ',cb,{...})) end

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

------ external command ------
function hs.ipc.handler(x) local fn, err = load('return '..x); if not fn then fn, err = load(x) end; local r; if fn then r = fn() else r = err end; return hs.json.encode({r}) end
-- local PORT = 34290
-- start(hs.httpserver.new(false,false):setPort(PORT):setCallback(function(type_,path,headers,body)
-- 	local x = assert(loadfile('/tmp/fs_ipc_'..PORT))()
-- 	return hs.json.encode({x}),200,{}
-- 	end))

------------------------------
-- start(hs.speech.listener.new():commands({'build','start','yes','github'}):setCallback(function(this,x) hs.alert('heard '..x) end))

-- start(hs.wifi.watcher.new(function() ... end))
-- hs.wifi.currentNetwork()
-- hsᵥ`hs.wifi.currentNetwork()`

-- 'sssss' on 1 off 2; 'lip pop' 3
-- start(hs.noises.new(function(x) hs.alert.show('noise'..x) end))

-- hs.uielement.focusedElement():selectedText()

-- http://hammerspoon.org/docs/hs.notify.html
-- hsᵥ`hs.notify.show('foo','bar','lorem ipsum')`

-- http://hammerspoon.org/docs/hs.pasteboard.html

-- http://hammerspoon.org/docs/hs.application.html & http://hammerspoon.org/docs/hs.hints.html & http://hammerspoon.org/docs/hs.grid.html & http://hammerspoon.org/docs/hs.layout.html & http://hammerspoon.org/docs/hs.mjomatic.html & http://hammerspoon.org/docs/hs.window.html & http://hammerspoon.org/docs/hs.window.filter.html & http://hammerspoon.org/docs/hs.window.switcher.html

------------ clock -----------
-- bonus = ''

time_bar = hs.menubar.new():priority(hs.menubar.priorities['system']) -- :setClickCallback(function() Z(nil,'shᵥ`open /System/Library/PreferencePanes/DateAndTime.prefPane`') end)
function update_time() local now = os.time(); time_bar:setTitle(os.date('%a -%m-%d %H:%M',now)..'⁝'..os.date('!%H:%M',now)..' Z'..'⁝'..string.gsub((now//60*60)..'','(.*)(.....)','%1 %2')) end
tb_timer = nil
loop = function() update_time(); tb_timer = hs.timer.doAfter(60 - os.time()%60,loop) end; loop()
start(hs.caffeinate.watcher.new(function (ev) if ev == hs.caffeinate.watcher.systemDidWake then update_time() end end))

-- function update_bonus() Z(function(e,x) bonus = x..' days to al-lex'; update_time() end,"((Time('2017-04-29T19:00Z').i - Time().i)/86400).toFixed(2)") end
-- tb_timer2 = nil
-- loop2 = function() update_bonus(); tb_timer2 = hs.timer.doAfter(864 - os.time()%864,loop2) end; loop2()
-- start(hs.caffeinate.watcher.new(function (ev) if ev == hs.caffeinate.watcher.systemDidWake then update_bonus() end end))
-- as a fun thing, you could get this all to ζ already so that you could have made this *easily*

-- local module = {}

-- local drawing = require("hs.drawing")
-- local timer   = require("hs.timer")
-- local uuid    = require"hs.host".uuid

-- module._visibleAlerts = {}

-- module.defaultStyle = {
--     fillColor   = { white = 0, alpha = 0.7058823529411764 },
--     textColor = { white = 1, alpha = 1 },
--     textFont  = ".AppleSystemUIFont",
--     textSize  = 14,
-- }

-- local purgeAlert = function(UUID, duration)
--     duration = math.max(duration, 0.0) or 0.15
--     local indexToRemove
--     for i,v in ipairs(module._visibleAlerts) do
--         if v.UUID == UUID then
--             if v.timer then v.timer:stop() end
--             for i2,v2 in ipairs(v.drawings) do
--                 v2:hide(duration)
--                 if duration > 0.0 then
--                     timer.doAfter(duration, function() v2:delete() end)
--                 end
--                 v.drawings[i2] = nil
--             end
--             indexToRemove = i
--             break
--         end
--     end
--     if indexToRemove then
--         table.remove(module._visibleAlerts, indexToRemove)
--     end
-- end

-- local showAlert = function(message)
--     local thisAlertStyle = module.defaultStyle

--     -- local screenFrame = hs.screen.mainScreen():fullFrame()
--     -- local top = screenFrame.h * (1 - 1 / 1.55) + 55 -- mimic module behavior for inverted rect
--     -- if #module._visibleAlerts > 0 then
--     --     top = module._visibleAlerts[#module._visibleAlerts].frame.y + module._visibleAlerts[#module._visibleAlerts].frame.h + 3
--     -- end
--     -- if top > screenFrame.h then
--     --     top = screen.mainScreen():frame().y
--     -- end

--     top = 0
--     left = 0

--     local alertEntry = {
--         drawings = {},
--     }
--     local UUID = uuid()
--     alertEntry.UUID = UUID

--     local textFrame = drawing.getTextDrawingSize(message, { font = thisAlertStyle.textFont, size = thisAlertStyle.textSize })
--     textFrame.w = textFrame.w + 4 -- known fudge factor, see hs.drawing.getTextDrawingSize docs
--     local drawingFrame = {
-- -- approximates, but it scales a *little* better than hard coded numbers for differing sizes...
--         -- x = screenFrame.x + (screenFrame.w - (textFrame.w + thisAlertStyle.textSize)) / 2,
--         x = left,
--         y = top,
--         h = math.max(44/2,textFrame.h),-- + thisAlertStyle.textSize,
--         w = math.max(2880/2,textFrame.w),-- + thisAlertStyle.textSize,
--     }
--     textFrame.x = drawingFrame.x-- + thisAlertStyle.textSize / 2
--     textFrame.y = drawingFrame.y+2-- + thisAlertStyle.textSize / 2

--     table.insert(alertEntry.drawings, drawing.rectangle(drawingFrame)
--                                             :setBehaviorByLabels({drawing.windowBehaviors['canJoinAllSpaces']})
--                                             :setFill(true)
--                                             :setFillColor(thisAlertStyle.fillColor)
--                                             :show(0.15)
--     )
--     table.insert(alertEntry.drawings, drawing.text(textFrame, message)
--                                             :setBehaviorByLabels({drawing.windowBehaviors['canJoinAllSpaces']})
--                                             :setTextFont(thisAlertStyle.textFont)
--                                             :setTextSize(thisAlertStyle.textSize)
--                                             :setTextColor(thisAlertStyle.textColor)
--                                             :orderAbove(alertEntry.drawings[1])
--                                             :show(0.15)
--     )
--     alertEntry.frame = drawingFrame

--     table.insert(module._visibleAlerts, alertEntry)
--     return UUID
-- end

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
