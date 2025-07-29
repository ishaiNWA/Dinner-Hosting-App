# Issues to Come Back To

## `auth-handler.js`

### Web Platform Error Handling
- Instead of `res.redirect(appRedirectUrls.WEB.ERROR(err));`, respond with a specific `.html` file.

### 
  - return http response for `test.js` authentication 

## Frontend UI Issues

### Dropdown Button Stacking Context
- **File**: `frontend/components/buttons/dropdown-buttons.tsx`
- **Issue**: Dropdown options appear behind other elements due to z-index/stacking context issues
- **Status**: Functionality works, but UI elements are not visible/clickable
- **Attempted fixes**: Added z-index values (1000, 1001, 1002) and position: relative
- **Next steps**: Investigate Input component from react-native-elements interference with stacking context 

