return {
	{
		dir = "~/projects/manim.nvim",
		-- Define default key mappings
		keys = {
			{ "<leader>ms", "<cmd>ManimRunScene<CR>", desc = "Run Manim Scene" },
			{ "<leader>mc", "<cmd>ManimCheckpointPaste<CR>", desc = "Checkpoint Paste" },
			{ "<leader>me", "<cmd>ManimExit<CR>", desc = "Manim Exit" },
		},
		config = function()
			-- Set the tmux target so it persists across sessions (until Neovim is restarted)
			vim.g.manim_tmux_target = "2" -- or whatever value you prefer
		end,
	},
}
