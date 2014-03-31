(function () {
  var bf = function bf(src) {
    if (!(this instanceof bf)) {
      return new bf(src);
    }

    this.src = src;
  };

  var token = {
    RIGHT_SHIFT: '>',
    LEFT_SHIFT: '<',
    PLUS: '+',
    MINUS: '-',
    OUTPUT: '.',
    INPUT: ',',
    LOOP_LEFT: '[',
    LOOP_RIGHT: ']'
  };

  bf.prototype.init = function (src) {
    this.src = src;
  };

  bf.run = bf.prototype.run = function (src) {
    var memory = [], pointer = 0, result = '';
    var i, depth, len;

    src = src || this.src;

    loop: for (i = 0, len = src.length; i < len; i += 1) {
      switch (src[i]) {
        case token.RIGHT_SHIFT:
          pointer++;
          break;

        case token.LEFT_SHIFT:
          pointer = pointer - 1 || 0;
          break;

        case token.PLUS:
          memory[pointer] = ((memory[pointer] || 0) + 1) & 255;
          break;

        case token.MINUS:
          memory[pointer] = ((memory[pointer] || 0) - 1) & 255;
          break;

        case token.OUTPUT:
          result += String.fromCharCode(memory[pointer]);
          break;

        case token.INPUT:
          memory[pointer] = (prompt('').charCodeAt(0) || 0) & 255;
          break;

        case token.LOOP_LEFT:
          depth = 1;

          if (!memory[pointer]) {
            for (i += 1; i < len; i += 1) {
              switch (src[i]) {
                case token.LOOP_LEFT:
                  depth += 1;
                  break;

                case token.LOOP_RIGHT:
                  depth -= 1;

                  if (!depth) {
                    continue loop;
                  }

                  break;
              }
            }

            throw new SyntaxError('Unexpected token');
          }

          break;

        case token.LOOP_RIGHT:
          depth = 1;

          if (memory[pointer]) {
            for (i -= 1; i > 0; i -= 1) {
              switch (src[i]) {
                case token.LOOP_LEFT:
                  depth -= 1;

                  if (!depth) {
                    continue loop;
                  }

                  break;

                case token.LOOP_RIGHT:
                  depth += 1;
                  break;
              }
            }

            throw new SyntaxError('Unexpected token');
          }

          break;
      }
    }

    return result;
  };

  this.bf = bf;
}).call(this);