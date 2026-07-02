-- Manim plugin - only loads if local development directory exists
local manim_dir = vim.fn.expand("~/projects/manim.nvim")

if vim.fn.isdirectory(manim_dir) == 1 then
  return {
    {
      dir = manim_dir,
      -- Define default key mappings
      keys = {
        { "<leader>ms", "<cmd>ManimRunScene<CR>", desc = "Run Manim Scene" },
        { "<leader>mc", "<cmd>ManimCheckpointPaste<CR>", desc = "Checkpoint Paste" },
        { "<leader>me", "<cmd>ManimExit<CR>", desc = "Manim Exit" },
      },
      config = function()
        -- Set the tmux target - only if tmux is available
        if vim.fn.executable('tmux') == 1 then
          vim.g.manim_tmux_target = "2" -- or whatever value you prefer
        end
      end,
    },
  }
else
  -- Return empty table if manim.nvim directory doesn't exist
  return {}
end
