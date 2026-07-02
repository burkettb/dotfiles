return {
  'akinsho/toggleterm.nvim',
  version = '*',
  config = function()
    require('toggleterm').setup {
      size = 20,
      open_mapping = [[<c-\>]],
      hide_numbers = true,
      shade_terminals = true,
      shading_factor = 2,
      start_in_insert = true,
      insert_mappings = true,
      persist_size = true,
      direction = 'float', -- 'vertical' | 'horizontal' | 'tab' | 'float'
      close_on_exit = true,
      shell = vim.o.shell,
      float_opts = {
        border = 'curved',
        winblend = 0,
        highlights = {
          border = 'Normal',
          background = 'Normal',
        },
      },
    }

    function _G.set_terminal_keymaps()
      local opts = { buffer = 0 }
      vim.keymap.set('t', '<esc>', [[<C-\><C-n>]], opts)
      vim.keymap.set('t', 'jk', [[<C-\><C-n>]], opts)
      vim.keymap.set('t', '<C-h>', [[<Cmd>wincmd h<CR>]], opts)
      vim.keymap.set('t', '<C-j>', [[<Cmd>wincmd j<CR>]], opts)
      vim.keymap.set('t', '<C-k>', [[<Cmd>wincmd k<CR>]], opts)
      vim.keymap.set('t', '<C-l>', [[<Cmd>wincmd l<CR>]], opts)
      vim.keymap.set('t', '<C-w>', [[<C-\><C-n><C-w>]], opts)
    end

    -- if you only want these mappings for toggle term use term://*toggleterm#* instead
    vim.cmd 'autocmd! TermOpen term://* lua set_terminal_keymaps()'

    local Terminal = require('toggleterm.terminal').Terminal

    -- Lazygit integration
    local lazygit = Terminal:new {
      cmd = 'lazygit',
      direction = 'float',
      float_opts = {
        border = 'double',
      },
      -- function to run on opening the terminal
      on_open = function(term)
        vim.cmd 'startinsert!'
        vim.api.nvim_buf_set_keymap(term.bufnr, 'n', 'q', '<cmd>close<CR>', { noremap = true, silent = true })
      end,
      -- function to run on closing the terminal
      on_close = function(term)
        vim.cmd 'startinsert!'
      end,
    }

    function _LAZYGIT_TOGGLE()
      lazygit:toggle()
    end

    -- Python REPL
    local python = Terminal:new {
      cmd = 'python3',
      direction = 'horizontal',
      size = 15,
    }

    function _PYTHON_TOGGLE()
      python:toggle()
    end

    -- Node REPL
    local node = Terminal:new {
      cmd = 'node',
      direction = 'horizontal',
      size = 15,
    }

    function _NODE_TOGGLE()
      node:toggle()
    end

    -- Keymaps
    vim.keymap.set('n', '<leader>tf', '<cmd>ToggleTerm direction=float<cr>', { desc = 'Terminal: Float' })
    vim.keymap.set('n', '<leader>th', '<cmd>ToggleTerm direction=horizontal<cr>', { desc = 'Terminal: Horizontal' })
    vim.keymap.set('n', '<leader>tv', '<cmd>ToggleTerm direction=vertical size=80<cr>', { desc = 'Terminal: Vertical' })
    vim.keymap.set('n', '<leader>gg', '<cmd>lua _LAZYGIT_TOGGLE()<CR>', { desc = 'Terminal: Lazygit' })
    vim.keymap.set('n', '<leader>tp', '<cmd>lua _PYTHON_TOGGLE()<CR>', { desc = 'Terminal: Python' })
    vim.keymap.set('n', '<leader>tn', '<cmd>lua _NODE_TOGGLE()<CR>', { desc = 'Terminal: Node' })
  end,
}