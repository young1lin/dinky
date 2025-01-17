import GeneralConfig from '@/pages/SettingCenter/GlobalSetting/SettingOverView/GeneralConfig';
import { BaseConfigProperties } from '@/types/SettingCenter/data';
import { l } from '@/utils/intl';
import { RadioChangeEvent, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

interface ResourcesConfigProps {
  data: BaseConfigProperties[];
  onSave: (data: BaseConfigProperties) => void;
}

const ModelType = {
  HDFS: 'HDFS',
  OSS: 'OSS'
};

type ResourceConfig = {
  base: BaseConfigProperties[];
  hdfs: BaseConfigProperties[];
  oss: BaseConfigProperties[];
};

export const ResourcesConfig = ({ data, onSave }: ResourcesConfigProps) => {
  const [loading, setLoading] = React.useState(false);
  const [model, setModel] = React.useState('hdfs');
  const [filterData, setFilterData] = useState<ResourceConfig>({
    base: [],
    hdfs: [],
    oss: []
  });

  useEffect(() => {
    // 处理 data / 规则: 前缀为 sys.resource.settings.base 的为基础配置，其他的为 hdfs/oss 配置
    const base: BaseConfigProperties[] = data.filter((d) =>
      d.key.startsWith('sys.resource.settings.base')
    );
    const hdfs: BaseConfigProperties[] = data.filter((d) =>
      d.key.startsWith('sys.resource.settings.hdfs')
    );
    const oss: BaseConfigProperties[] = data.filter((d) =>
      d.key.startsWith('sys.resource.settings.oss')
    );
    setFilterData({ base, hdfs, oss });
    // 获取当前的 model
    const currentModel = base.find((d) => d.key === 'sys.resource.settings.base.model')?.value;
    if (currentModel) {
      setModel(currentModel);
    }
    console.log('data', data, 'filterData', currentModel, 'currentModel');
  }, [data]);

  const modelKey: string = 'sys.resource.settings.base.model';

  const onSaveHandler = async (data: BaseConfigProperties) => {
    setLoading(true);
    await onSave(data);
    setLoading(false);
  };
  const selectChange = async (e: RadioChangeEvent) => {
    const { value } = e.target;
    setModel(value);
    await onSaveHandler({
      name: '',
      example: [],
      frontType: '',
      key: modelKey,
      note: '',
      value: value.toString().toLocaleUpperCase()
    });
  };
  return (
    <>
      <GeneralConfig
        loading={loading}
        onSave={onSaveHandler}
        tag={<Tag color={'default'}>{l('sys.setting.tag.integration')}</Tag>}
        data={filterData.base}
        selectChanges={selectChange}
      />
      {model.toLocaleUpperCase() === ModelType.HDFS && (
        <GeneralConfig
          loading={loading}
          onSave={onSaveHandler}
          tag={<Tag color={'default'}>{l('sys.setting.tag.integration')}</Tag>}
          data={filterData.hdfs}
        />
      )}
      {model.toLocaleUpperCase() === ModelType.OSS && (
        <GeneralConfig
          loading={loading}
          onSave={onSaveHandler}
          tag={<Tag color={'default'}>{l('sys.setting.tag.integration')}</Tag>}
          data={filterData.oss}
        />
      )}
    </>
  );
};
