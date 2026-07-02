return {
  'folke/persistence.nvim',
  event = 'BufReadPre', -- this will only start session saving when an actual file was opened
  opts = {
    -- add any custom options here
  },
  config = function()
    require('persistence').setup {
      dir = vim.fn.expand(vim.fn.stdpath 'state' .. '/sessions/'), -- directory where session files are saved
      options = { 'buffers', 'curdir', 'tabpages', 'winsize', 'help', 'globals', 'skiprtp' }, -- sessionoptions used for saving
      pre_save = nil, -- a function to call before saving the session
      save_empty = false, -- don't save if there are no open file buffers
    }

    -- Keymaps
    vim.keymap.set('n', '<leader>qs', function()
      require('persistence').save()
    end, { desc = 'Session: Save current session' })

    vim.keymap.set('n', '<leader>ql', function()
      require('persistence').load()
    end, { desc = 'Session: Load session for current directory' })

    vim.keymap.set('n', '<leader>qd', function()
      require('persistence').stop()
    end, { desc = 'Session: Stop persistence (session will not be saved on exit)' })

    vim.keymap.set('n', '<leader>qr', function()
      require('persistence').load { last = true }
    end, { desc = 'Session: Restore last session' })
  end,
}