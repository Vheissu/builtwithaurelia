export class AsyncBindingBehavior {
 
  bind(binding, source, busymessage) {
    binding.originalupdateTarget = binding.updateTarget;
    binding.updateTarget = (a) => { 
      if (typeof a.then === 'function') {
        if (busymessage) 
          binding.originalupdateTarget(busymessage);
        a.then(d => { binding.originalupdateTarget(d); });
      }
      else
        binding.originalupdateTarget(a);
     };
  }
 
  unbind(binding) {
    binding.updateTarget = binding.originalupdateTarget;
    binding.originalupdateTarget = null;
  }
}
