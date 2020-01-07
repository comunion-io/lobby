<template>
  <div class="publish-token-form">
    <el-form ref="tokenPublishForm" :rules="formRules" :model="formParams">
      <el-form-item
        label="Select token logo (Upload PNG or JPG format. Maximum file size: 1M. Recommended size: 120*120KB )"
        prop="icon"
      >
        <br />
        <!-- action="http://178.128.221.42:8080/a/upload" -->
        <el-upload
          class="icon-uploader"
          action="http://dao-test.comunion.io/a/upload"
          accept=".jpg, .jpeg, .png, .PNG, .JPG, .JPEG"
          :multiple="false"
          name="upload"
          :show-file-list="false"
          list-type="picture-card"
          :on-success="handleUploadSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="formParams.icon" :src="formParams.icon" class="icon-view" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="Token name" prop="name">
        <el-input
          v-model="formParams.name"
          class="input-width"
          placeholder="Token full name. e.g. Ethereum"
        ></el-input>
      </el-form-item>
      <el-form-item label="Token symbol" prop="symbol">
        <el-input
          v-model="formParams.symbol"
          class="input-width"
          placeholder="Token name abbreviation. e.g. ETH"
        ></el-input>
      </el-form-item>
      <el-form-item label="Total supply" prop="supply">
        <el-input v-model="formParams.supply" class="input-width" placeholder="Total supply"></el-input>
      </el-form-item>
      <el-button class="btn-main btn-width" @click="submitForm('tokenPublishForm')" round>Publish</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'publish-token-form',
  data() {
    return {
      imageUrl: '',
      formParams: {
        icon: '',
        name: '',
        symbol: '',
        supply: 88888
      },
      formRules: {
        icon: [
          {
            required: true,
            message: 'Please upload the logo of the token',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            validator: this.checkInputName
          }
        ],
        symbol: [
          {
            required: true,
            validator: this.checkInputSymbol
          }
        ],
        supply: [
          {
            required: true,
            validator: this.checkInputSupply
          }
        ]
      }
    }
  },
  methods: {
    checkInputName(rule, value, callback) {
      var regp = /[^A-Za-z0-9]+/g
      if (!value) {
        return callback(new Error('Please input the full name of the token'))
      } else if (regp.test(value)) {
        return callback(new Error('Only letters and numbers'))
      } else {
        return callback()
      }
    },
    checkInputSymbol(rule, value, callback) {
      var regp = /[^A-Za-z0-9]+/g
      if (!value) {
        return callback(
          new Error('Please input the abbreviation name of the token')
        )
      } else if (regp.test(value)) {
        return callback(new Error('Only letters and numbers'))
      } else {
        return callback()
      }
    },
    checkInputSupply(rule, value, callback) {
      var regp = /[^0-9]+/g
      if (!value) {
        return callback(new Error('Please input the supply of the token'))
      } else if (value.length > 20) {
        return callback(new Error('Length less than 20 digits'))
      } else if (regp.test(value)) {
        return callback(new Error('Only numbers'))
      } else {
        return callback()
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    handleFileChange(file, fileList) {
      if (fileList.length === 1) {
        document.querySelector('.el-upload--picture-card').style.visibility =
          'hidden'
      }
    },
    handleFileRemove(file) {
      document.querySelector('.el-upload--picture-card').style.visibility =
        'visible'
      this.formParams.logo = ''
    },
    beforeAvatarUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('Picture size can not exceed 1MB!')
      }
      return isLt1M
    },
    handleUploadSuccess(response, file, fileList) {
      this.formParams.icon = response.url
      this.$refs.tokenPublishForm.validateField('icon')
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('clickPublish', this.formParams)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.publish-token-form {
  .icon-view {
    border-radius: 50%;
    height: 72px;
    width: 72px;
    overflow: hidden;
  }
  .icon-uploader {
    .el-upload--picture-card {
      border-radius: 50%;
      height: 72px;
      width: 72px;
      line-height: 83px;
      background: #cbced7;
      border: none;
    }
    .el-icon-plus:before {
      color: #fff;
      font-size: bold;
    }
  }
  .input-width {
    width: 480px;
    display: block;
  }
  .btn-width {
    width: 144px;
    margin-top: 14px;
  }
}
</style>