export const IDParamFilter = ($location, IDService) => {
  /**
   * @param {object} model
   * @returns {string}
   */
  return (model) => {
    if (!model || !model.$id) return
    // Remove to local hostname from the url (if present) to save characters
    return IDService.encodeURI(model.$id)
  }
}
