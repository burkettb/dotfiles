-- Simple ColdFusion support configuration
-- Create filetype detection and basic settings for ColdFusion files

-- Set up filetype detection
vim.filetype.add({
  extension = {
    cfm = 'cfml',
    cfc = 'cfml',
    cfml = 'cfml',
  },
})

-- Auto-commands for ColdFusion files
vim.api.nvim_create_autocmd('FileType', {
  pattern = { 'cfml', 'cfm', 'cfc' },
  callback = function()
    -- Set ColdFusion-specific options
    vim.opt_local.commentstring = '<!--- %s --->'
    vim.opt_local.suffixesadd = '.cfm,.cfc,.cfml'
    
    -- Set up ColdFusion-specific indentation
    vim.opt_local.shiftwidth = 2
    vim.opt_local.tabstop = 2
    vim.opt_local.softtabstop = 2
    vim.opt_local.expandtab = true
    
    -- ColdFusion-specific folding
    vim.opt_local.foldmethod = 'indent'
    
    -- Set up basic syntax highlighting (HTML-like)
    vim.cmd('setlocal syntax=html')
  end,
})

-- ColdFusion-specific keymaps
vim.api.nvim_create_autocmd('FileType', {
  pattern = { 'cfml', 'cfm', 'cfc' },
  callback = function()
    local opts = { buffer = true, silent = true }
    vim.keymap.set('n', '<leader>cfr', '<cmd>!cfcompile %<cr>', vim.tbl_extend('force', opts, { desc = 'Compile CF file' }))
    vim.keymap.set('n', '<leader>cfl', '<cmd>!cflint %<cr>', vim.tbl_extend('force', opts, { desc = 'Lint CF file' }))
  end,
})

-- Return empty table since we're not using plugin manager for this
return {}