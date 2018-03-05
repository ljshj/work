package com.lenovohit.hwe.base.utils;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.base.model.Images;

/**
 * 文件上传工具类
 * 
 * @author yangdc
 * @date Apr 18, 2012
 * 
 *       <pre>
 *       </pre>
 */
@Component
public class ImagesUtils {
	// 最大文件大小
	public static long UPLOAD_MAXSIZE;
	// 文件上传基础目录
	public static String UPLOAD_BASEPATH;
	// 文件上传基础目录
	//public static String UPLOAD_PATH = System.getProperty("user.dir")+"//src//main//resources//static//";
	// 文件上传目录
	//public static String UPLOAD_UPLOAD;
	// 图片相对目录
	public static String UPLOAD_IMAGES;
	// FLASHS相对目录
	public static String UPLOAD_FLASHS;
	// MEDIAS相对目录
	public static String UPLOAD_MEDIAS;
	// 文件相对目录
	public static String UPLOAD_FILES;
	// 临时相对目录
	public static String UPLOAD_TEMPS;
	// 定义允许上传的文件扩展名
	private static Map<String, String> UPLOAD_TYPEMAP = new HashMap<String, String>();
	// 定义允许上传的文件扩展名
	private static Map<String, String> UPLOAD_EXTMAP = new HashMap<String, String>();

//	static {
//		Properties p = null;
//		try {
//			p = PropertiesLoaderUtils.loadAllProperties("application-config-el-base.properties");
//
//			UPLOAD_MAXSIZE = Long.valueOf(p.getProperty("upload.maxsize"));
//
//			UPLOAD_BASEPATH = p.getProperty("upload.basepath");
//			UPLOAD_UPLOAD = p.getProperty("upload.upload");
//			UPLOAD_IMAGES = p.getProperty("upload.images");
//			UPLOAD_FLASHS = p.getProperty("upload.flashs");
//			UPLOAD_MEDIAS = p.getProperty("upload.medias");
//			UPLOAD_FILES = p.getProperty("upload.files");
//			UPLOAD_TEMPS = p.getProperty("upload.temps");
//
//			UPLOAD_TYPEMAP.put("files", UPLOAD_FILES);
//			UPLOAD_TYPEMAP.put("images", UPLOAD_IMAGES);
//			UPLOAD_TYPEMAP.put("flashs", UPLOAD_FLASHS);
//			UPLOAD_TYPEMAP.put("medias", UPLOAD_MEDIAS);
//			UPLOAD_TYPEMAP.put("temps", UPLOAD_TEMPS);
//
//			UPLOAD_EXTMAP.put("images", "gif,jpg,jpeg,png,bmp");
//			UPLOAD_EXTMAP.put("flashs", "swf,flv");
//			UPLOAD_EXTMAP.put("medias", "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb");
//			UPLOAD_EXTMAP.put("files", "doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2");
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}

	/**
	 * 文件显示
	 * 
	 * @param file
	 * @return Map
	 * @throws IOException
	 */
	public static void viewImage(OutputStream os, String fileName) throws Exception {
		InputStream in = null;

		if (StringUtils.isBlank(fileName)) { // 检查文件
			throw new BaseException("文件名为空！");
		}

		String savePath = UPLOAD_BASEPATH + UPLOAD_IMAGES;
		try {
			in = new BufferedInputStream(new FileInputStream(new File(savePath, fileName)));
			byte[] buff = new byte[2048000];
			while (in.read(buff, 0, buff.length) > 0) {
				os.write(buff, 0, buff.length);
			}
		} catch (IOException e) {
			e.printStackTrace();
			throw new BaseException("读取图片失败！！！");
		} finally {
			if (in != null) {
				in.close();
			}
		}
	}
	
	
	/**
	 * 多文件显示
	 * 
	 * @param file
	 * @return Map
	 * @throws IOException
	 */
	public static void viewImage(OutputStream os, Images image) throws Exception {
		viewImage(os,image.getFileName());
		if (os != null) {
			os.close();
		}
	}
	
	/**
	 * 单文件显示
	 * 
	 * @param file
	 * @return Map
	 * @throws IOException
	 */
	public static void viewImages(OutputStream os, List<Images> images) throws Exception {
		if(images!=null&&images.size()>0){
			for(int i=0;i<images.size();i++){
				viewImage(os,images.get(i).getFileName());
			}
		}
		if (os != null) {
			os.close();
		}
	}

	/**
	 * 文件上传
	 * 
	 * @param file
	 * @return Map
	 * @throws IOException
	 */
	public static Map<String, Object> uploadImage(MultipartFile file) throws Exception {

		Map<String, Object> map = new HashMap<String, Object>();
		if (null == file) {
			throw new BaseException("文件为空！");
		}

		String fileName = file.getOriginalFilename();
		String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
		long fileSize = file.getSize();
		if (fileSize > UPLOAD_MAXSIZE) { // 检查文件大小
			throw new BaseException("上传文件大小超过限制");
		} else if (!Arrays.<String> asList(UPLOAD_EXTMAP.get("images").split(",")).contains(fileExt)) {// 检查扩展名
			throw new BaseException("上传文件扩展名是不允许的扩展名。\n只允许" + UPLOAD_EXTMAP.get("images") + "格式。");
		} else {
			/*if("".equals(id) ){
				id = com.lenovohit.core.utils.StringUtils.uuid();
			}*/
			
			//String newFileName = id + "." + fileExt;
			
			String savePath =  UPLOAD_BASEPATH + UPLOAD_IMAGES;
			
			// String targetPath = TARGET_PATH + UPLOAD_IMAGES;
			
			BufferedOutputStream os = null;
			

			try {
				byte[] bytes = file.getBytes();
				File dir = new File(savePath);
				if (!dir.exists()) {
					dir.mkdirs();
				}
				
				// 上传到项目目录
				os = new BufferedOutputStream(new FileOutputStream(new File(savePath, fileName)));
				os.write(bytes);
				
				map.put("fileExt", fileExt);
				map.put("fileName", fileName);
				map.put("fileSize", new java.text.DecimalFormat("#.00").format((double) fileSize / 1024));
				map.put("filePath", UPLOAD_IMAGES + fileName);

			} catch (IOException e) {
				e.printStackTrace();
				throw new BaseException("上传失败了！！！");
			} finally {
				if (os != null) {
					os.close();
				}
			}
		}

		return map;
	}
	
	@Value("${hwe.upload.maxsize:10485760}")
	public void setUPLOAD_MAXSIZE(long uPLOAD_MAXSIZE) {
		UPLOAD_MAXSIZE = uPLOAD_MAXSIZE;
	}

	@Value("${hwe.upload.basepath:/HWEFS/}")
	public void setUPLOAD_BASEPATH(String uPLOAD_BASEPATH) {
		UPLOAD_BASEPATH = uPLOAD_BASEPATH;
	}

	@Value("${hwe.upload.images:images/}")
	public void setUPLOAD_IMAGES(String uPLOAD_IMAGES) {
		UPLOAD_IMAGES = uPLOAD_IMAGES;
	}

	@Value("${hwe.upload.flashs:flashs/}")
	public void setUPLOAD_FLASHS(String uPLOAD_FLASHS) {
		UPLOAD_FLASHS = uPLOAD_FLASHS;
	}
	
	@Value("${hwe.upload.medias:medias/}")
	public void setUPLOAD_MEDIAS(String uPLOAD_MEDIAS) {
		UPLOAD_MEDIAS = uPLOAD_MEDIAS;
	}

	@Value("${hwe.upload.files:files/}")
	public void setUPLOAD_FILES(String uPLOAD_FILES) {
		UPLOAD_FILES = uPLOAD_FILES;
	}

	@Value("${hwe.upload.temp:temps/}")
	public void setUPLOAD_TEMPS(String uPLOAD_TEMPS) {
		UPLOAD_TEMPS = uPLOAD_TEMPS;
	}
	
	@Value("${hwe.upload.type}")
	public void setUPLOAD_TYPEMAP(String type) {
		String[] typeArr = null;
		String[] attrArr = null;
		if(StringUtils.isNotBlank(type)){
			typeArr = type.split("\\|");
			for(String attr : typeArr){
				attrArr = attr.split(":");
				UPLOAD_TYPEMAP.put(attrArr[0], attrArr[1]);
			}
		}
	
	}
	
	@Value("${hwe.upload.ext}")
	public void setUPLOAD_EXTMAP(String ext) {

		String[] typeArr = null;
		String[] attrArr = null;
		if(StringUtils.isNotBlank(ext)){
			typeArr = ext.split("\\|");
			for(String attr : typeArr){
				attrArr = attr.split(":");
				UPLOAD_EXTMAP.put(attrArr[0], attrArr[1]);
			}
		}
	}

}