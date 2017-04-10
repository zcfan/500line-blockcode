(function ( global ) {
  var dragTarget   = null
  var dragType     = null
  var scriptBlocks = []

  function drag ( evt ) {
    if ( !matches( evt.target, '.block' ) ) return
    if ( matches( evt.target, '.menu .block' ) ) {
      dragType = 'menu'
    } else {
      dragType = 'script'
    }
    evt.target.classList.add( 'dragging' )
    dragTarget   = evt.target
    scriptBlocks = [].slice.call( document.querySelectorAll( '.script .block:not(.draging)' ) )

    // for firefox bug
    evt.dataTransfer.setData( 'text/html', evt.target.outerHTML )
    if ( matches( evt.target, '.menu .block' ) ) {
      evt.dataTransfer.effectAllowed = 'copy'
    } else {
      evt.dataTransfer.effectAllowed = 'move'
    }
  }

  function dragOver ( evt ) {
    if ( !matches( evt.target, '.menu, .menu *, .script, .script *, .content' ) ) {
      return
    }
    if ( evt.preventDefault ) {
      evt.preventDefault()
    }
    if ( dragType === 'menu' ) {
      evt.dataTransfer.dropEffect = 'copy'
    } else {
      evt.dataTransfer.dropEffect = 'move'
    }
    return false
  }

  function drop ( evt ) {
    if ( !matches( evt.target, '.menu, .menu *, .script, .script *' ) ) return
    var dropTarget = closest(
      evt.target, '.script .container, .script .block, .menu, .script'
    )
    var dropType   = 'script'
    if ( matches( dropTarget, '.menu' ) ) {
      dropType = 'menu'
    }

    if ( evt.stopPropagation ) {
      evt.stopPropagation()
    }
    if ( dragType === 'script' && dropType === 'menu' ) {
      trigger( 'blockRemoved', dragTarget.parentElement, dragTarget )
      dragTarget.parentElement.removeChild( dragTarget )
    } else if ( dragType === 'script' && dropType === 'script' ) {
      if ( matches( dropTarget, '.block' ) ) {
        dropTarget.parentElement.insertBefore( dragTarget, dropTarget.nextSibling )
      } else {
        dropTarget.insertBefore( dragTarget, dropTarget.firstChildElement )
      }
      trigger( 'blockMoved', dropTarget, dragTarget )
    } else if ( dragType === 'menu' && dropType === 'script' ) {
      var newNode = dragTarget.cloneNode(true)
      newNode.classList.remove('dragging')
      if (matches(dropTarget, '.block')) {
        dropTarget.parentElement.insertBefore( newNode, dropTarget.nextSibling )
      } else {
        dropTarget.insertBefore( newNode, dropTarget.firstChildElement)
      }
      trigger('blockAdded', dropTarget, newNode)
    }
  }

  function _findAndRemoveClass ( klass ) {
    var elem = document.querySelector('.'+klass)
    if (elem) {elem.classList.remove(klass)}
  }
  
  function dragEnd ( evt ) {
    _findAndRemoveClass('dragging')
    _findAndRemoveClass('over')
    _findAndRemoveClass('next')
  }
})( window )
