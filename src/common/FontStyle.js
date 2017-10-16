import Preferences from '../Preferences';
const styles={
  FiraSansBl:{fontFamily:'FiraSansCondensed-Black'},
  FiraSansBlI:{fontFamily:'FiraSansCondensed-BlackItalic'},
  FiraSansB:{fontFamily:'FiraSansCondensed-Bold'},
  FiraSansBI:{fontFamily:'FiraSansCondensed-BoldItalic'},
  FiraSansEB:{fontFamily:'FiraSansCondensed-ExtraBold'},
  FiraSansEBI:{fontFamily:'FiraSansCondensed-ExtraBoldItalic'},
  FiraSansEL:{fontFamily:'FiraSansCondensed-ExtraLight'},
  FiaSansELI:{fontFamily:'FiraSansCondensed-ExtraLightItalic'},
  FiaSansI:{fontFamily:'FiraSansCondensed-Italic'},
  FiaSansL:{fontFamily:'FiraSansCondensed-Light'},
  FiaSansLI:{fontFamily:'FiraSansCondensed-LightItalic'},
  FiaSansM:{fontFamily:'FiraSansCondensed-Medium'},
  FiaSansMI:{fontFamily:'FiraSansCondensed-MediumItalic'},
  FiaSansR:{fontFamily:'FiraSansCondensed-Regular'},
  FiaSansSB:{fontFamily:'FiraSansCondensed-SemiBold'},
  FiaSansSBI:{fontFamily:'FiraSansCondensed-SemiBoldItalic'},
  FiaSansT:{fontFamily:'FiraSansCondensed-Thin'},
  FiaSansTI:{fontFamily:'FiraSansCondensed-ThinItalic'},
  FiaMonoB:{fontFamily:'FiraMono-Bold'},
  FiaMonoM:{fontFamily:'FiraMono-Medium'},
  FiaMonoR:{fontFamily:'FiraMono-Regular'},
  getMMFontStyle:()=>{
    switch(Preferences.fontType){
      case 1:
        return {fontFamily:'sanpya'};
        break;
      default:
        return {};
        break;
    }
  }
}


export default styles;
