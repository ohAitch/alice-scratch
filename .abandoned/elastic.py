# gdamn it, just implement elastic tabstops already, or something else table-like and similar to them

# i'd even kinda like if if typing
# 	code: ...
# 	frenge: ...
# produced
# 	code  : ...
# 	frenge: ...

import sublime, sublime_plugin
import re, sys, itertools

"""
def get_selected_rows(view):
	selected_rows = set()
	for s in view.sel():
		begin_row,_ = view.rowcol(s.begin())
		end_row,_ = view.rowcol(s.end())
		# Include one row before and after the selection, to cover cases like
		# hitting enter at the beginning of a line: affect both the newly-split
		# block and the block remaining above.
		list(map(selected_rows.add, range(begin_row-1, end_row+1 + 1)))
	return selected_rows

def tabs_for_row(view, row):
	row_tabs = []
	for tab in re.finditer("\t", view.substr(view.line(view.text_point(row,0)))):
		row_tabs.append(tab.start())
	return row_tabs

def selection_columns_for_row(view, row):
	selections = []
	for s in view.sel():
		if s.empty():
			r, c =view.rowcol(s.a)
			if r == row:
				selections.append(c)
	return selections

def rightmost_selection_in_cell(selection_columns, cell_right_edge):
	rightmost = 0
	if len(selection_columns):
		rightmost = max([s if s <= cell_right_edge else 0 for s in selection_columns])
	return rightmost

def cell_widths_for_row(view, row):
	selection_columns = selection_columns_for_row(view, row)
	tabs = [-1] + tabs_for_row(view, row)
	widths = [0] * (len(tabs) - 1)
	line = view.substr(view.line(view.text_point(row,0)))
	for i in range(0,len(tabs)-1):
		left_edge = tabs[i]+1
		right_edge = tabs[i+1]
		rightmost_selection = rightmost_selection_in_cell(selection_columns, right_edge)
		cell = line[left_edge:right_edge]
		widths[i] = max(len(cell.rstrip()), rightmost_selection - left_edge)
	return widths

def find_cell_widths_for_block(view, row):
	cell_widths = []
	
	#starting row and backward
	row_iter = row
	while row_iter >= 0:
		widths = cell_widths_for_row(view, row_iter)
		if len(widths) == 0:
			break
		cell_widths.insert(0, widths)
		row_iter -= 1
	first_row = row_iter + 1
	
	#forward (not including starting row)
	row_iter = row
	num_rows = view.rowcol(view.size())[0]+1
	while row_iter < num_rows - 1:
		row_iter += 1
		widths = cell_widths_for_row(view, row_iter)
		if len(widths) == 0:
			break
		cell_widths.append(widths)
	
	return cell_widths, first_row

def adjust_row(edit, view, glued, row, widths):
	row_tabs = tabs_for_row(view, row)
	if len(row_tabs) == 0:
		return glued
	bias = 0
	location = -1
	
	for w, it in zip(widths,row_tabs):
		location += 1 + w
		it += bias
		difference = location - it
		if difference == 0:
			continue
		
		end_tab_point = view.text_point(row, it)
		partial_line = view.substr(view.line(end_tab_point))[0:it]
		stripped_partial_line = partial_line.rstrip()
		ispaces = len(partial_line) - len(stripped_partial_line)
		if difference > 0:
			view.run_command("maybe_mark_undo_groups_for_gluing")
			glued = True
			#put the spaces after the tab and then delete the tab, so any insertion
			#points behave as expected
			view.insert(edit, end_tab_point+1, (' ' * difference) + "\t")
			view.erase(edit, sublime.Region(end_tab_point, end_tab_point + 1))
			bias += difference
		if difference < 0 and ispaces >= -difference:
			view.run_command("maybe_mark_undo_groups_for_gluing")
			glued = True
			view.erase(edit, sublime.Region(end_tab_point, end_tab_point + difference))
			bias += difference
	return glued

def set_block_cell_widths_to_max(cell_widths):
	starting_new_block = True
	for c, column in enumerate(itertools.zip_longest(*cell_widths, fillvalue=-1)):
		#add an extra -1 to the end so that the end of the column automatically
		#finishes a block
		column += (-1,)
		done = False
		for r, width in enumerate(column):
			if starting_new_block:
				block_start_row = r
				starting_new_block = False
				max_width = 0
			if width == -1:
				#block ended
				block_end_row = r
				for j in range(block_start_row, block_end_row):
					cell_widths[j][c] = max_width
				starting_new_block = True
			max_width = max(max_width, width)

def process_rows(edit, view, rows):
	glued = False
	checked_rows = set()
	for row in rows:
		if row in checked_rows:
			continue
		
		cell_widths_by_row, row_index = find_cell_widths_for_block(view, row)
		set_block_cell_widths_to_max(cell_widths_by_row)
		for widths in cell_widths_by_row:
			checked_rows.add(row_index)
			glued = adjust_row(edit, view, glued, row_index, widths)
			row_index += 1
	if glued:
		view.run_command("glue_marked_undo_groups")

def fix_view(view):
	# When modifying a clone of a view, Sublime Text will only pass in
	# the original view ID, which means we refer to the wrong selections.
	# Fix which view we have.
	active_view = sublime.active_window().active_view()
	if view == None:
		view = active_view
	elif view.id() != active_view.id() and view.buffer_id() == active_view.buffer_id():
		view = active_view
	return view

class _(sublime_plugin.EventListener):
	selected_rows_by_view = {}
	running = False
	
	def on_modified(self, view):
		if self.running: return
		
		view = fix_view(view)
		
		history_item = view.command_history(1)[1]
		if history_item:
			if history_item.get('name') == "ElasticTabstops":
				return
			if history_item.get('commands') and history_item['commands'][0][1].get('name') == "ElasticTabstops":
				return
		
		selected_rows = self.selected_rows_by_view.get(view.id(), set())
		selected_rows = selected_rows.union(get_selected_rows(view))
		
		try:
			self.running = True
			translate = False
			if view.settings().get("translate_tabs_to_spaces"):
				translate = True
				view.settings().set("translate_tabs_to_spaces", False)
			
			view.run_command('elastic_tabstops_update',{'rows': selected_rows})
			
		finally:
			self.running = False
			if translate:
				view.settings().set("translate_tabs_to_spaces",True)
	
	def on_selection_modified(self, view):
		view = fix_view(view)
		self.selected_rows_by_view[view.id()] = get_selected_rows(view)
	
	def on_activated(self, view):
		view = fix_view(view)
		self.selected_rows_by_view[view.id()] = get_selected_rows(view)

class elastic_tabstops_update(sublime_plugin.TextCommand):
	def run(self, edit, rows=None):
		view = self.view
		if not rows: rows = range(0, view.rowcol(view.size())[0]+1)
		process_rows(edit, self.view, rows)

class move_by_cells(sublime_plugin.TextCommand):
	def run(self, edit, direction, extend):
		new_regions = []
		for s in self.view.sel():
			line = self.view.substr(self.view.line(s.b))
			row, col = self.view.rowcol(s.b)
			if direction == "right":
				next_tab_col = line[col+1:].find('\t')
				if next_tab_col == -1:
					next_tab_col = len(line)
				else:
					next_tab_col += col + 1
			elif direction == "left":
				next_tab_col = line[:max(col-1, 0)].rfind('\t')
				if next_tab_col == -1:
					next_tab_col = 0
				else:
					next_tab_col += 1
			else:
				raise Exception("invalid direction")
				next_tab_col = s.b
			
			b = self.view.text_point(row, next_tab_col)
			
			if extend:
				new_regions.append(sublime.Region(s.a, b))
			else:
				new_regions.append(sublime.Region(b, b))
		sel = self.view.sel()
		sel.clear()
		for r in new_regions:
			sel.add(r)
"""

# maybe run view.run_command('elastic_tabstops_update') every so often in case the existing heuristics fail?

# [
# 	{ "keys": ["ctrl+alt+right"], "command": "move_by_cells", "args": {"direction": "right", "extend": false} },
# 	{ "keys": ["ctrl+alt+left"], "command": "move_by_cells", "args": {"direction": "left", "extend": false} },
# 	{ "keys": ["ctrl+alt+shift+right"], "command": "move_by_cells", "args": {"direction": "right", "extend": true} },
# 	{ "keys": ["ctrl+alt+shift+left"], "command": "move_by_cells", "args": {"direction": "left", "extend": true} }
# ]

"""
---------------------------------------  ---------------------------------------
-------------------- ==> thoughts on elastic tabstops.α <== --------------------
---------------------------------------  ---------------------------------------

// 2014-05-23

// units are css units
tab_raster ← '1px'
indent_minimum ← '4em'
tab_minimum ← '1px'
tab_padding ← '0.5em'

// whenever the document is altered, call stretchTabstops

// todo: needs optimising - a lot of this should be cached if possible
void stretchTabstops(StyledDocument doc)
{
	Element section = doc.getDefaultRootElement()

	int maxTabstops = 32 // todo: magic number hardcoded
	int lineCount = section.getElementCount()
	ETLine lines[] = new ETLine[lineCount]
	ETTabstop grid[][] = new ETTabstop[lineCount][maxTabstops]

	// initialise array
	for (int l = 0; l < lineCount; l++) // for each line
	{
		lines[l] = new ETLine()
		for (int t = 0; t < maxTabstops; t++) // for each column
		{
			grid[l][t] = new ETTabstop()
		}
	}

	// get width of text in cells
	for (int l = 0; l < lineCount; l++) // for each line
	{
		Element line = section.getElement(l)
		int lineStart = line.getStartOffset()
		int lineEnd = line.getEndOffset()
		lines[l].startPos = lineStart
		lines[l].endPos = lineEnd
		try
		{
			String lineText = doc.getText(lineStart, lineEnd - lineStart)
			int textWidthInTab = 0
			int currentTabNum = 0
			int lineLength = lineText.length()
			for (int c = 0; c < lineLength; c++) // for each char in current line
			{
				char currentChar = lineText.charAt(c)
				if (currentChar == '\n')
				{
					grid[l][currentTabNum].endsInTab = false
					grid[l][currentTabNum].endPos = lineStart + c
					textWidthInTab = 0
				}
				else if (currentChar == '\t')
				{
					grid[l][currentTabNum].endsInTab = true
					grid[l][currentTabNum].endPos = lineStart + c
					grid[l][currentTabNum].textWidthPix = calcTabWidth(textWidthInTab,?)
					currentTabNum++
					grid[l][currentTabNum].startPos = lineStart + c + 1
					lines[l].numTabs++
					textWidthInTab = 0
				}
				else
				{
					textWidthInTab += magic.charWidth(currentChar)
				}
			}
		}
		catch (BadLocationException ex)
		{
		}
	}

	// find columns blocks and stretch to fit the widest cell
	for (int t = 0; t < maxTabstops; t++) // for each column
	{
		// all tabstops in column block point to same number
		theWidestWidthPix ← {v:0} // reference
		int maxWidth = 0
		for (int l = 0; l < lineCount; l++) // for each line
		{
			if (grid[l][t].endsInTab)
			{
				grid[l][t].widestWidthPix = theWidestWidthPix // copy ref
				if (grid[l][t].textWidthPix < maxWidth)
				{
					grid[l][t].textWidthPix = maxWidth
				}
				else
				{
					maxWidth = grid[l][t].textWidthPix
					theWidestWidthPix.v = maxWidth
				}
			}
			else // end column block
			{
				theWidestWidthPix = {v:0} // reference
				maxWidth = 0
			}
		}
	}

	// apply tabstop sizes to the text
	for (int l = 0; l < lineCount; l++) // for each line
	{
		// accumulate tabstop widths
		int accTabstop = 0
		for (int t = 0; t < lines[l].numTabs; t++) {
			accTabstop += grid[l][t].widestWidthPix.v
			grid[l][t].textWidthPix = accTabstop
		}

		Element line = section.getElement(l)
		int lineStart = line.getStartOffset()
		int lineEnd = line.getEndOffset()
		setBlocksTabstops(doc, lineStart, lineEnd, grid[l], lines[l].numTabs)
	}
}

int calcTabWidth(int textWidthInTab){
	t ← tab_raster='0'? textWidthInTab :
		err('tab_raster not implemented') // (((int)(textWidthInTab / tab_raster)) + 1) * tab_raster
	return Math.max(t + tab_padding, textWidthInTab=0? indent_minimum : tab_minimum)}

void setBlocksTabstops(StyledDocument doc, int start, int length, ETTabstop[] tabstopPositions, int tabstopCount)
{
	TabStop[] tabs = new TabStop[tabstopCount]

	for (int j = 0; j < tabstopCount; j++)
		tabs[j] = new TabStop(tabstopPositions[j].textWidthPix)

	TabSet tabSet = new TabSet(tabs)
	SimpleAttributeSet attributes = new SimpleAttributeSet()
	StyleConstants.setTabSet(attributes, tabSet)

	doc.setParagraphAttributes(start, length, attributes, false)
}

package com.nickgravgaard.elastictabstops;

public class ETLine
{
	int startPos = 0;
	int endPos = 0;
	int numTabs = 0;
}

package com.nickgravgaard.elastictabstops;

public class ETTabstop
{
	int textWidthPix;
	MutableInteger widestWidthPix = null; // object so we can use refs
	int startPos = 0;
	int endPos = 0;
	boolean endsInTab = false;

	public ETTabstop()
	{
	}
}
"""
