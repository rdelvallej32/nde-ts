import * as chalk from 'chalk';
const log = console.log;

type ChalkColor = 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray';
type ChalkStyle = 'bold' | 'dim' | 'italic' | 'underline' | 'inverse' | 'strikethrough';

class TerminalStyle {
  private title: string;

  public setTitle(title: string, color: ChalkColor): void {
    this.title = chalk.bold[color](`${title}: `);
  }

  public setMessage(msg: string, msgStyle: ChalkStyle): void {
    log(this.title + chalk[msgStyle].white(msg));
  }
}

export class TerminalColor {
  private termStyle = new TerminalStyle();

  setAppTitle(title: string) {
    this.termStyle.setTitle(title, 'yellow')
  }

  setAppMessage(msg: string) {
    this.termStyle.setMessage(msg, 'bold')
  }
}

export const AppColor = new TerminalColor()
