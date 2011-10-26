<?php

class Page {

	private $script_dir = '',
		$template_dir = '',
		$id = '',
		$type = '',
		$title = '',
		$scripts = array(),
		$templates = array();
	
	public function __construct( $id, $data ) {
		// Verzeichnis für Scripts
		$this->script_dir = ABSPATH.'inc/';
		// Verzeichnis für Templates
		$this->template_dir = ABSPATH.'tpl/';
		// Seiten-ID
		$this->id = $id;
		// Seitentyp
		$this->type = isset($data['type']) && in_array($data['type'],array('html','json')) ? $data['type'] : 'json';
		// Seitentitel
		if( !empty($data['title']) )
			$this->title = $data['title'];
		// Scripts
		if( isset($data['script']) && is_array($data['script']) )
			foreach( $data['script'] as $script )
				$this->addTemplate($script);
		elseif( isset($data['script']) && !empty($data['script']))
			$this->addTemplate($data['script']);
		// Templates
		if( is_array($data['tpl']) )
			foreach( $data['tpl'] as $tpl )
				$this->addTemplate($tpl);
		elseif(!empty($data['tpl']))
			$this->addTemplate($data['tpl']);
	}
	
	public function type() {
		return $this->type;
	}
	
	public function id() {
		return $this->id;
	}
	
	public function title() {
		return $this->title;
	}
	
	public function scripts() {
		return $this->scripts;
	}
	
	public function templates() {
		return $this->templates;
	}
	
	private function addScript( $script ) {
		if( is_file($this->script_dir.$script.'.php') )
			array_push($this->scripts,$this->script_dir.$script.'.php');
	}

	private function addTemplate( $template ) {
		if( is_file($this->template_dir.$template.'.php') )
			array_push($this->templates,$this->template_dir.$template.'.php');
	}
	
}

?>
