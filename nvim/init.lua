-- Neovim 0.12+ config. Plugins come from the built-in manager (vim.pack);
-- update them with :lua vim.pack.update(). Versions are pinned in
-- nvim-pack-lock.json next to this file.

vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- Options ---------------------------------------------------------------------
local o = vim.opt
o.number, o.relativenumber = true, true
o.mouse = "a"
o.showmode = false -- mini.statusline shows it
o.clipboard = "unnamedplus"
o.breakindent, o.undofile = true, true
o.ignorecase, o.smartcase = true, true
o.signcolumn = "yes"
o.updatetime, o.timeoutlen = 250, 300
o.splitright, o.splitbelow = true, true
o.list, o.listchars = true, { tab = "» ", trail = "·", nbsp = "␣" }
o.inccommand = "split"
o.cursorline = true
o.scrolloff = 10
o.completeopt = "menu,menuone,noinsert,popup"

-- Plugins ---------------------------------------------------------------------
local gh = function(repo) return "https://github.com/" .. repo end
vim.pack.add({
	gh("folke/tokyonight.nvim"),
	gh("echasnovski/mini.nvim"), -- statusline, icons, surround, textobjects
	gh("ibhagwan/fzf-lua"), -- fuzzy finder (replaces telescope; uses brew fzf)
	gh("stevearc/oil.nvim"),
	gh("lewis6991/gitsigns.nvim"),
	gh("tpope/vim-fugitive"),
	gh("christoomey/vim-tmux-navigator"), -- Ctrl-hjkl across nvim and tmux panes
	gh("stevearc/conform.nvim"),
	gh("neovim/nvim-lspconfig"), -- only for its lsp/<server>.lua defaults
	{ src = gh("nvim-treesitter/nvim-treesitter"), version = "main" },
}, { confirm = false })
vim.cmd.packadd("nvim.undotree") -- built-in :Undotree (0.12)

vim.cmd.colorscheme("tokyonight-night")
vim.cmd.hi("Comment gui=none")

require("mini.icons").setup()
MiniIcons.mock_nvim_web_devicons() -- oil and fzf-lua icons without devicons
require("mini.ai").setup({ n_lines = 500 })
require("mini.surround").setup()
require("mini.statusline").setup()
MiniStatusline.section_location = function() return "%2l:%-2v" end

require("gitsigns").setup({
	signs = { add = { text = "+" }, change = { text = "~" }, delete = { text = "_" },
		topdelete = { text = "‾" }, changedelete = { text = "~" } },
})

local oil = require("oil")
oil.setup({
	columns = { "icon" },
	keymaps = { ["<C-h>"] = false, ["<C-l>"] = false, ["<C-k>"] = false, ["<C-j>"] = false,
		["<C-p>"] = false, ["<M-h>"] = "actions.select_split" },
	view_options = { show_hidden = true },
})
vim.api.nvim_create_autocmd("User", { pattern = "OilEnter", callback = vim.schedule_wrap(function(args)
	if vim.api.nvim_get_current_buf() == args.data.buf and oil.get_cursor_entry() then oil.open_preview() end
end) })

require("conform").setup({
	notify_on_error = false,
	formatters_by_ft = { lua = { "stylua" } },
	default_format_opts = { lsp_format = "fallback" },
	format_on_save = function(buf)
		if vim.tbl_contains({ "c", "cpp" }, vim.bo[buf].filetype) then return end
		return { timeout_ms = 500 }
	end,
})

local fzf = require("fzf-lua")
fzf.setup({ files = { hidden = true }, grep = { hidden = true } })
fzf.register_ui_select()

-- Treesitter: highlight with whatever parser exists (nvim ships c, lua,
-- markdown, vim, vimdoc). Installing more parsers needs the tree-sitter CLI.
local parsers = { "bash", "diff", "go", "html", "javascript", "json", "python", "rust", "tsx", "typescript", "yaml" }
if vim.fn.executable("tree-sitter") == 1 then require("nvim-treesitter").install(parsers) end
vim.api.nvim_create_autocmd("FileType", { callback = function(args)
	if pcall(vim.treesitter.start, args.buf) then
		vim.bo[args.buf].indentexpr = "v:lua.require'nvim-treesitter'.indentexpr()"
	end
end })

-- LSP: servers installed by Homebrew; nvim-lspconfig supplies cmd/filetypes.
vim.lsp.config("lua_ls", { settings = { Lua = {
	runtime = { version = "LuaJIT" },
	workspace = { library = { vim.env.VIMRUNTIME }, checkThirdParty = false },
} } })
for server, bin in pairs({ lua_ls = "lua-language-server", ts_ls = "typescript-language-server",
	gopls = "gopls", rust_analyzer = "rust-analyzer", ruff = "ruff", pyright = "pyright-langserver" }) do
	if vim.fn.executable(bin) == 1 then vim.lsp.enable(server) end
end

vim.api.nvim_create_autocmd("LspAttach", { callback = function(ev)
	local client = assert(vim.lsp.get_client_by_id(ev.data.client_id))
	local map = function(lhs, rhs, desc)
		vim.keymap.set("n", lhs, rhs, { buffer = ev.buf, nowait = true, desc = "LSP: " .. desc })
	end
	map("gd", fzf.lsp_definitions, "definition")
	map("gr", fzf.lsp_references, "references")
	map("gI", fzf.lsp_implementations, "implementation")
	map("gD", vim.lsp.buf.declaration, "declaration")
	map("<leader>D", fzf.lsp_typedefs, "type definition")
	map("<leader>ds", fzf.lsp_document_symbols, "document symbols")
	map("<leader>ws", fzf.lsp_live_workspace_symbols, "workspace symbols")
	map("<leader>rn", vim.lsp.buf.rename, "rename")
	map("<leader>ca", vim.lsp.buf.code_action, "code action")
	map("<leader>th", function() vim.lsp.inlay_hint.enable(not vim.lsp.inlay_hint.is_enabled()) end, "toggle inlay hints")
	-- Built-in completion: menu pops as you type; <C-n>/<C-p> move, <C-y> accepts.
	if client:supports_method("textDocument/completion") then
		vim.lsp.completion.enable(true, client.id, ev.buf, { autotrigger = true })
	end
end })

-- Keymaps ---------------------------------------------------------------------
local map = vim.keymap.set
-- Deletes/changes go to register z so they don't clobber the system clipboard.
for _, k in ipairs({ "d", "x", "c" }) do map({ "n", "v" }, k, '"z' .. k) end
map("n", "<Esc>", "<cmd>nohlsearch<CR>")
map("n", "<leader>e", vim.diagnostic.open_float, { desc = "Diagnostic float" })
map("n", "<leader>q", vim.diagnostic.setloclist, { desc = "Diagnostics to loclist" })
map("t", "<Esc><Esc>", "<C-\\><C-n>", { desc = "Exit terminal mode" })
map("i", "<C-Space>", vim.lsp.completion.get, { desc = "Trigger completion" })
map({ "i", "s" }, "<C-l>", function() vim.snippet.jump(1) end, { desc = "Snippet next" })
map({ "i", "s" }, "<C-h>", function() vim.snippet.jump(-1) end, { desc = "Snippet prev" })
map("", "<leader>f", function() require("conform").format({ async = true }) end, { desc = "Format buffer" })

map("n", "<leader>sf", fzf.files, { desc = "Search files" })
map("n", "<C-p>", fzf.git_files, { desc = "Git files" })
map("n", "<leader>sg", fzf.live_grep, { desc = "Live grep" })
map("n", "<leader>sw", fzf.grep_cword, { desc = "Grep word under cursor" })
map("n", "<leader>sh", fzf.helptags, { desc = "Help" })
map("n", "<leader>sk", fzf.keymaps, { desc = "Keymaps" })
map("n", "<leader>sd", fzf.diagnostics_workspace, { desc = "Diagnostics" })
map("n", "<leader>sr", fzf.resume, { desc = "Resume last search" })
map("n", "<leader>s.", fzf.oldfiles, { desc = "Recent files" })
map("n", "<leader>ss", fzf.builtin, { desc = "All pickers" })
map("n", "<leader>sn", function() fzf.files({ cwd = vim.fn.stdpath("config") }) end, { desc = "Neovim config" })
map("n", "<leader>/", fzf.blines, { desc = "Search current buffer" })
map("n", "<leader><leader>", fzf.buffers, { desc = "Buffers" })

map("n", "-", "<cmd>Oil<CR>", { desc = "Open parent directory" })
map("n", "<leader>-", oil.toggle_float, { desc = "Oil float" })
map("n", "<leader>u", "<cmd>Undotree<CR>", { desc = "Undo tree" })
map("n", "<leader>gg", function() -- lazygit in a floating terminal
	local w, h = math.floor(vim.o.columns * 0.9), math.floor(vim.o.lines * 0.9)
	local buf = vim.api.nvim_create_buf(false, true)
	vim.api.nvim_open_win(buf, true, { relative = "editor", width = w, height = h, border = "rounded",
		row = math.floor((vim.o.lines - h) / 2), col = math.floor((vim.o.columns - w) / 2) })
	vim.fn.jobstart("lazygit", { term = true, on_exit = function() pcall(vim.api.nvim_buf_delete, buf, { force = true }) end })
	vim.cmd.startinsert()
end, { desc = "Lazygit" })

vim.api.nvim_create_autocmd("TextYankPost", { callback = function() vim.hl.on_yank() end })
